# -*- coding: utf-8 -*-
import json
import re

with open('public/data/questions.json', 'r', encoding='utf-8') as f:
    qs = json.load(f)

def normalize_text(t):
    if not t:
        return ''
    t = re.sub(r'\s*\([Cc]âu\s*\d+\)\s*$', '', t.strip())
    t = re.sub(r'\s*\(Question\s*\d+\)\s*$', '', t.strip())
    return t.strip()

groups = {}
for q in qs:
    norm_vi = normalize_text(q.get('question', {}).get('vi', ''))
    opts_vi = tuple(q.get('options', {}).get('vi', []))
    correct = q.get('correctIndex')
    key = (norm_vi, opts_vi, correct)
    groups.setdefault(key, []).append(q)

dups_groups = {k: v for k, v in groups.items() if len(v) > 1}
total_dups = sum(len(v) - 1 for v in dups_groups.values())

with open('scripts/duplicate_report.txt', 'w', encoding='utf-8') as out:
    out.write(f"Total questions in bank: {len(qs)}\n")
    out.write(f"Unique questions: {len(groups)}\n")
    out.write(f"Total duplicates to remove: {total_dups}\n\n")
    for i, (k, v) in enumerate(dups_groups.items(), 1):
        out.write(f"=== Group {i}: {len(v)} occurrences ===\n")
        out.write(f"Question: {k[0]}\n")
        out.write(f"Options: {list(k[1])}\n")
        out.write(f"Correct: {k[2]}\n")
        out.write(f"IDs: {[x['id'] for x in v]}\n\n")

print(f"Report written. Total questions: {len(qs)}, Unique: {len(groups)}, Duplicates: {total_dups}")
