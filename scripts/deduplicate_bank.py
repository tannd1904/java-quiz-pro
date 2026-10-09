# -*- coding: utf-8 -*-
"""
Deduplicate question bank.
Removes duplicate questions (identical question, options, explanation, correctIndex, code, image).
Strips suffix (Câu ...) and (Question ...) from cleaned questions.
Updates:
- public/data/questions.json
- ngan_hang_de.json
- quiz_data.js
"""

import json
import re

def normalize_text(t):
    if not t:
        return ''
    t = re.sub(r'\s*\([Cc]âu\s*\d+\)\s*$', '', t.strip())
    t = re.sub(r'\s*\(Question\s*\d+\)\s*$', '', t.strip())
    return t.strip()

def main():
    with open('public/data/questions.json', 'r', encoding='utf-8') as f:
        original_qs = json.load(f)

    print(f"Original total questions: {len(original_qs)}")

    seen_keys = set()
    deduped = []
    removed_count = 0

    for q in original_qs:
        norm_q_vi = normalize_text(q.get('question', {}).get('vi', ''))
        opts_vi = tuple(q.get('options', {}).get('vi', []))
        norm_exp_vi = normalize_text(q.get('explanation', {}).get('vi', ''))
        correct = q.get('correctIndex')
        code = q.get('codeSnippet')
        img = q.get('image')

        key = (norm_q_vi, opts_vi, norm_exp_vi, correct, code, img)
        if key in seen_keys:
            removed_count += 1
            continue

        seen_keys.add(key)

        clean_q = dict(q)
        clean_q['question'] = dict(q['question'])
        clean_q['question']['vi'] = normalize_text(q['question']['vi'])
        if 'en' in clean_q['question'] and clean_q['question']['en']:
            clean_q['question']['en'] = normalize_text(clean_q['question']['en'])

        deduped.append(clean_q)

    print(f"Removed duplicates: {removed_count}")
    print(f"Remaining unique questions: {len(deduped)}")

    # Ensure all IDs are unique
    ids = set()
    for q in deduped:
        assert q['id'] not in ids, f"Duplicate ID: {q['id']}"
        ids.add(q['id'])

    # Write to public/data/questions.json
    with open('public/data/questions.json', 'w', encoding='utf-8') as f:
        json.dump(deduped, f, ensure_ascii=False, indent=2)
    print("Wrote public/data/questions.json")

    # Write to ngan_hang_de.json
    with open('ngan_hang_de.json', 'w', encoding='utf-8') as f:
        json.dump(deduped, f, ensure_ascii=False, indent=2)
    print("Wrote ngan_hang_de.json")

    # Update quiz_data.js
    update_quiz_data_js(deduped)

def update_quiz_data_js(all_qs):
    topic_map = {
        "encapsulation": ("Encapsulation (Tính Đóng Gói & Access Modifiers)", "Encapsulation", "🔒"),
        "inheritance": ("Inheritance (Tính Kế Thừa)", "Inheritance", "🧬"),
        "polymorphism": ("Polymorphism (Tính Đa Hình & Overriding)", "Polymorphism", "🎭"),
        "abstraction": ("Abstraction (Tính Trừu Tượng & Abstract Class)", "Abstraction", "🌫️"),
        "interface": ("Interface (Giao Diện & Default Methods)", "Interface", "🔌"),
        "constructor": ("Constructor (Hàm Tạo & Khởi Tạo Đối Tượng)", "Constructor", "🏗️"),
        "static_final": ("Từ Khóa Static & Final Trong Java", "Static & Final", "⚡"),
        "exception": ("Exception Handling (Xử Lý Ngoại Lệ)", "Exception", "🛡️"),
        "string": ("String, StringBuilder & StringBuffer", "String", "📝"),
        "memory_jvm": ("Bộ Nhớ Java (Heap, Stack, Garbage Collector)", "Bộ Nhớ & JVM", "🧠"),
        "arrays": ("Mảng Trong Java (Arrays)", "Mảng (Arrays)", "📊"),
        "collections": ("Java Collections Framework (List, Set, Map)", "Collections", "📚"),
        "io_scanner": ("Java I/O & Scanner (Nhập Xuất Dữ Liệu)", "Java I/O", "⌨️"),
        "control_flow": ("Cấu Trúc Điều Khiển (if-else, switch, loops)", "Điều Khiển", "🔄"),
        "design_patterns": ("Java Design Patterns Cơ Bản (OOP)", "Design Patterns", "📐"),
        "objects_classes": ("Objects and Classes (Lớp và Đối tượng)", "Objects & Classes", "📦"),
        "lambda": ("Lambda Expressions & Functional Interface", "Lambda", "λ"),
        "inner_class": ("Inner Class & Nested Class (Lớp lồng nhau)", "Inner Class", "🪆"),
        "core_java": ("Core Java (Căn Bản & Tổng Hợp)", "Core Java", "☕")
    }

    legacy_items = []
    for i, q in enumerate(all_qs):
        tid = q['topicId']
        tinfo = topic_map.get(tid, ("Core Java", "Core Java", "☕"))
        correct_idx = q['correctIndex']
        correct_text = q['options']['vi'][correct_idx] if 0 <= correct_idx < len(q['options']['vi']) else ""

        legacy_items.append({
            "id": i + 1,
            "bank_id": q['id'],
            "category": q['category']['vi'],
            "topicId": tid,
            "topicName": tinfo[0],
            "topicShortName": tinfo[1],
            "topicIcon": tinfo[2],
            "question": q['question']['vi'],
            "codeSnippet": q.get('codeSnippet'),
            "image": q.get('image'),
            "options": q['options']['vi'],
            "correctIndex": correct_idx,
            "correct_text": correct_text,
            "explanation": q['explanation']['vi']
        })

    with open('quiz_data.js', 'r', encoding='utf-8') as f:
        content = f.read()

    cfg_start = content.find("const TOPICS_CONFIG = [")
    cfg_end = content.find("];\n\nconst QUIZ_DATA = ")
    legacy_topics = json.loads(content[cfg_start + len("const TOPICS_CONFIG = "):cfg_end + 1])

    header = f"// NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM JAVA ONLINE (TỔNG HỢP {len(legacy_items)} CÂU)\n"
    topics_config_part = f"const TOPICS_CONFIG = {json.dumps(legacy_topics, ensure_ascii=False, indent=2)};\n\n"
    quiz_data_part = f"const QUIZ_DATA = {json.dumps(legacy_items, ensure_ascii=False, indent=2)};\n"

    with open('quiz_data.js', 'w', encoding='utf-8') as f:
        f.write(header + topics_config_part + quiz_data_part)
    print("Wrote quiz_data.js")

if __name__ == '__main__':
    main()
