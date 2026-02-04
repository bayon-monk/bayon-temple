#!/usr/bin/env python3
"""
Bayon Field Analytics
Analyze engagement logs to detect patterns in field work.
"""

import json
import sys
from collections import defaultdict
from datetime import datetime

def load_engagements(filepath):
    """Load JSONL engagement log."""
    engagements = []
    with open(filepath, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('{\"_'):
                continue
            try:
                engagements.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return engagements

def analyze(engagements):
    """Generate analysis report."""
    if not engagements:
        return "No engagements logged yet."

    # Basic counts
    total = len(engagements)
    shifts = sum(1 for e in engagements if e.get('shift') == True)
    no_shifts = sum(1 for e in engagements if e.get('shift') == False)

    # By intervention type
    by_type = defaultdict(lambda: {'total': 0, 'shifts': 0})
    for e in engagements:
        t = e.get('intervention_type', 'unknown')
        by_type[t]['total'] += 1
        if e.get('shift'):
            by_type[t]['shifts'] += 1

    # By level
    by_level = defaultdict(lambda: {'total': 0, 'shifts': 0})
    for e in engagements:
        lvl = e.get('level', 0)
        by_level[lvl]['total'] += 1
        if e.get('shift'):
            by_level[lvl]['shifts'] += 1

    # By openness
    high_openness_shifts = sum(1 for e in engagements
                               if e.get('openness_pre', 0) >= 5 and e.get('shift'))
    low_openness_shifts = sum(1 for e in engagements
                              if e.get('openness_pre', 0) < 5 and e.get('shift'))

    # E-delta analysis
    e_deltas = []
    for e in engagements:
        pre = e.get('pre_e')
        post = e.get('post_e')
        if pre is not None and post is not None:
            e_deltas.append(post - pre)

    avg_delta = sum(e_deltas) / len(e_deltas) if e_deltas else 0

    # Build report
    report = []
    report.append("=" * 50)
    report.append("BAYON FIELD ANALYTICS")
    report.append("=" * 50)
    report.append("")
    report.append(f"Total engagements: {total}")
    report.append(f"Shifts achieved: {shifts} ({shifts/total*100:.1f}%)" if total else "")
    report.append(f"No shift: {no_shifts}")
    report.append("")

    report.append("BY INTERVENTION TYPE:")
    report.append("-" * 30)
    for t, stats in sorted(by_type.items()):
        rate = stats['shifts'] / stats['total'] * 100 if stats['total'] else 0
        report.append(f"  {t}: {stats['shifts']}/{stats['total']} shifts ({rate:.0f}%)")
    report.append("")

    report.append("BY LEVEL:")
    report.append("-" * 30)
    for lvl in sorted(by_level.keys()):
        stats = by_level[lvl]
        rate = stats['shifts'] / stats['total'] * 100 if stats['total'] else 0
        report.append(f"  L{lvl}: {stats['shifts']}/{stats['total']} shifts ({rate:.0f}%)")
    report.append("")

    report.append("OPENNESS CORRELATION:")
    report.append("-" * 30)
    report.append(f"  High openness (>=5) shifts: {high_openness_shifts}")
    report.append(f"  Low openness (<5) shifts: {low_openness_shifts}")
    report.append("")

    if e_deltas:
        report.append("E-SCORE MOVEMENT:")
        report.append("-" * 30)
        report.append(f"  Average ΔE per engagement: {avg_delta:+.2f}")
        report.append(f"  Total ΔE contribution: {sum(e_deltas):+.2f}")
    report.append("")

    # Mechanisms that worked
    mechanisms = [e.get('mechanism') for e in engagements
                  if e.get('shift') and e.get('mechanism')]
    if mechanisms:
        report.append("MECHANISMS THAT WORKED:")
        report.append("-" * 30)
        for m in mechanisms[:10]:  # Top 10
            report.append(f"  • {m}")

    report.append("")
    report.append("=" * 50)

    return "\n".join(report)


def main():
    filepath = sys.argv[1] if len(sys.argv) > 1 else 'engagements.jsonl'
    try:
        engagements = load_engagements(filepath)
        print(analyze(engagements))
    except FileNotFoundError:
        print(f"No engagement log found at {filepath}")
        print("Create one by logging engagements in JSONL format.")

if __name__ == '__main__':
    main()
