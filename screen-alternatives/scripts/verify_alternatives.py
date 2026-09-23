#!/usr/bin/env python3
"""
verify_alternatives.py - Report and Structure Validator for Screen Alternatives

Validates that a generated report strictly adheres to the 16 Definition of Done
criteria, formatting schemas, and structural constraints.
"""

import sys
import re
from pathlib import Path


def verify_report_text(report_content: str) -> dict:
    """
    Audits the report text against the Screen Alternatives specification.
    """
    results = {
        "passed": True,
        "errors": [],
        "warnings": [],
        "metadata": {}
    }

    lines = [line.strip() for line in report_content.strip().splitlines() if line.strip()]
    if not lines:
        results["passed"] = False
        results["errors"].append("Report is empty.")
        return results

    # 1. First line must be Screen job
    first_line = lines[0]
    if not first_line.lower().startswith("screen job:"):
        results["passed"] = False
        results["errors"].append(f"Line 1 must start with 'Screen job:', found: '{first_line[:40]}...'")
    else:
        results["metadata"]["screen_job"] = first_line

    # 2. Second line must be Current screen
    if len(lines) > 1:
        second_line = lines[1]
        if not second_line.lower().startswith("current screen:"):
            results["passed"] = False
            results["errors"].append(f"Line 2 must start with 'Current screen:', found: '{second_line[:40]}...'")
        else:
            results["metadata"]["current_screen"] = second_line
    else:
        results["passed"] = False
        results["errors"].append("Missing 'Current screen:' evaluation line.")

    # 3. Check for Stress-Test Findings table
    if "### Stress-Test Findings" not in report_content and "## Stress-Test Findings" not in report_content:
        results["passed"] = False
        results["errors"].append("Missing 'Stress-Test Findings' heading.")
    else:
        # Count findings in markdown table
        finding_rows = re.findall(r'\|\s*(\d+)\s*\|([^|]+)\|([^|]+)\|([^|]+)\|', report_content)
        count = len(finding_rows)
        results["metadata"]["findings_count"] = count
        if count == 0:
            results["passed"] = False
            results["errors"].append("No findings found in the Stress-Test Findings table.")
        elif count > 8:
            results["passed"] = False
            results["errors"].append(f"Too many findings ({count}). Maximum allowed is 8.")

    # 4. Check for Alternatives table
    if "### Alternatives" not in report_content and "## Alternatives" not in report_content:
        results["passed"] = False
        results["errors"].append("Missing 'Alternatives' heading.")
    else:
        alt_a_match = re.search(r'\|\s*Alt A\s*\|([^|]+)\|([^|]+)\|([^|]+)\|', report_content, re.IGNORECASE)
        alt_b_match = re.search(r'\|\s*Alt B\s*\|([^|]+)\|([^|]+)\|([^|]+)\|', report_content, re.IGNORECASE)
        alt_c_match = re.search(r'\|\s*Alt C\s*\|', report_content, re.IGNORECASE)

        if not alt_a_match:
            results["passed"] = False
            results["errors"].append("Missing 'Alt A' in Alternatives table.")
        if not alt_b_match:
            results["passed"] = False
            results["errors"].append("Missing 'Alt B' in Alternatives table.")
        if alt_c_match:
            results["passed"] = False
            results["errors"].append("Found 'Alt C' in Alternatives table. Exactly two alternatives allowed.")

    # 5. Check for Considered but Rejected
    if "Considered but Rejected" not in report_content:
        results["passed"] = False
        results["errors"].append("Missing 'Considered but Rejected' section.")

    # 6. Check for How to Decide
    if "How to Decide" not in report_content:
        results["passed"] = False
        results["errors"].append("Missing 'How to Decide' section.")
    else:
        # Check that it's concise
        decide_part = report_content.split("How to Decide")[-1].strip()
        decide_lines = [l for l in decide_part.splitlines() if l.strip() and not l.strip().startswith("#")]
        if decide_lines:
            decision_text = decide_lines[0].strip()
            results["metadata"]["how_to_decide"] = decision_text
            sentence_count = len(re.findall(r'[.!?]+', decision_text))
            if sentence_count > 2:
                results["warnings"].append(
                    f"'How to Decide' should ideally be a single concise sentence (detected {sentence_count} sentences)."
                )

    return results


def main():
    if len(sys.argv) < 2:
        print("Usage: python verify_alternatives.py <path_to_report.md>")
        sys.exit(1)

    file_path = Path(sys.argv[1])
    if not file_path.exists():
        print(f"Error: File {file_path} not found.")
        sys.exit(1)

    content = file_path.read_text(encoding="utf-8")
    report_results = verify_report_text(content)

    print("=" * 60)
    print(f"VERIFICATION REPORT: {file_path.name}")
    print("=" * 60)
    print(f"Status: {'PASSED ✅' if report_results['passed'] else 'FAILED ❌'}")
    print(f"Metadata: {report_results['metadata']}")

    if report_results["errors"]:
        print("\nErrors:")
        for err in report_results["errors"]:
            print(f"  ❌ {err}")

    if report_results["warnings"]:
        print("\nWarnings:")
        for warn in report_results["warnings"]:
            print(f"  ⚠️ {warn}")

    print("=" * 60)
    sys.exit(0 if report_results["passed"] else 1)


if __name__ == "__main__":
    main()
