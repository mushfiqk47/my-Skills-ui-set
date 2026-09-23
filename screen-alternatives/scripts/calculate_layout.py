#!/usr/bin/env python3
"""
calculate_layout.py - Layout Geometry and Parity Validator for Screen Alternatives

Provides deterministic mathematical calculations for:
1. Spatial positioning of Original, Alt A, and Alt B on the Figma canvas.
2. Caption label coordinate offsets.
3. Concentric corner radius calculations (R_outer = R_inner + padding).
4. Content census parity checks between original and alternative representations.
"""

import sys
import json
from typing import Dict, Any, Tuple


def calculate_canvas_coordinates(
    orig_x: float,
    orig_y: float,
    orig_width: float,
    orig_height: float,
    gap: float = 200.0,
    caption_offset_y: float = 48.0
) -> Dict[str, Any]:
    """
    Computes exact canvas coordinates for Alt A, Alt B, and their caption labels.
    """
    alt_a_x = orig_x + orig_width + gap
    alt_a_y = orig_y

    alt_b_x = alt_a_x + orig_width + gap
    alt_b_y = orig_y

    return {
        "original": {
            "x": orig_x,
            "y": orig_y,
            "width": orig_width,
            "height": orig_height
        },
        "alt_a": {
            "x": alt_a_x,
            "y": alt_a_y,
            "width": orig_width,
            "height": orig_height,
            "caption": {
                "x": alt_a_x,
                "y": alt_a_y - caption_offset_y
            }
        },
        "alt_b": {
            "x": alt_b_x,
            "y": alt_b_y,
            "width": orig_width,
            "height": orig_height,
            "caption": {
                "x": alt_b_x,
                "y": alt_b_y - caption_offset_y
            }
        }
    }


def calculate_concentric_radius(inner_radius: float, padding: float) -> float:
    """
    Computes the concentric outer border radius:
    R_outer = R_inner + padding
    """
    if inner_radius < 0 or padding < 0:
        raise ValueError("Radius and padding must be non-negative.")
    return inner_radius + padding


def verify_content_parity(original_census: Dict[str, int], alt_census: Dict[str, int]) -> Tuple[bool, list]:
    """
    Compares original content census against an alternative census to enforce Content Parity.
    """
    issues = []
    all_keys = set(original_census.keys()).union(set(alt_census.keys()))

    for key in sorted(all_keys):
        orig_count = original_census.get(key, 0)
        alt_count = alt_census.get(key, 0)
        if orig_count != alt_count:
            issues.append(
                f"Content parity violation for '{key}': Original has {orig_count}, Alternative has {alt_count}."
            )

    return (len(issues) == 0, issues)


def main():
    if len(sys.argv) < 5:
        print("Usage: python calculate_layout.py <orig_x> <orig_y> <orig_width> <orig_height> [gap]")
        print("Example: python calculate_layout.py 0 0 1440 900 200")
        sys.exit(1)

    try:
        x = float(sys.argv[1])
        y = float(sys.argv[2])
        w = float(sys.argv[3])
        h = float(sys.argv[4])
        gap = float(sys.argv[5]) if len(sys.argv) > 5 else 200.0
    except ValueError as e:
        print(f"Error parsing coordinates: {e}")
        sys.exit(1)

    layout = calculate_canvas_coordinates(x, y, w, h, gap)
    print(json.dumps(layout, indent=2))


if __name__ == "__main__":
    main()
