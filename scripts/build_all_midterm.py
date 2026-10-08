# -*- coding: utf-8 -*-
"""
Build and validate the midterm question bank.
Combines all 590 new questions, verifies schema and integrity,
and writes to public/data/questions.json, ngan_hang_de.json, and quiz_data.js.
"""

import json
import os
import re
from gen_objects_classes import get_objects_classes_questions
from gen_oop_pillars import get_oop_pillars_questions
from gen_interfaces import get_interfaces_questions
from gen_lambda import get_lambda_questions
from gen_inner_classes import get_inner_classes_questions
from gen_exceptions import get_exceptions_questions

VIET_CHARS = set('àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ')

def check_vietnamese(text):
    for c in text.lower():
        if c in VIET_CHARS:
            return True
    return False

def main():
    print("Collecting questions from all modules...")
    obj_qs = get_objects_classes_questions()
    oop_qs = get_oop_pillars_questions()
    if_qs = get_interfaces_questions()
    lam_qs = get_lambda_questions()
    inn_qs = get_inner_classes_questions()
    exp_qs = get_exceptions_questions()

    print(f"Objects & Classes: {len(obj_qs)}")
    print(f"4 OOP Pillars:     {len(oop_qs)}")
    print(f"Interfaces:        {len(if_qs)}")
    print(f"Lambda:            {len(lam_qs)}")
    print(f"Inner Classes:     {len(inn_qs)}")
    print(f"Exceptions:        {len(exp_qs)}")

    new_qs = obj_qs + oop_qs + if_qs + lam_qs + inn_qs + exp_qs
    print(f"Total new questions: {len(new_qs)}")

    # Load existing questions
    with open('public/data/questions.json', 'r', encoding='utf-8') as f:
        existing_qs = json.load(f)
    print(f"Existing questions: {len(existing_qs)}")

    existing_ids = set(q['id'] for q in existing_qs)

    # Validate new questions
    new_ids = set()
    for q in new_qs:
        qid = q['id']
        assert qid not in existing_ids, f"ID collision with existing question: {qid}"
        assert qid not in new_ids, f"Duplicate ID in new questions: {qid}"
        new_ids.add(qid)

        assert len(q['options']['vi']) == 4, f"Question {qid} does not have 4 VI options"
        assert len(q['options']['en']) == 4, f"Question {qid} does not have 4 EN options"
        assert 0 <= q['correctIndex'] < 4, f"Question {qid} invalid correctIndex"

        # Check English fields do not have Vietnamese characters
        if check_vietnamese(q['question']['en']):
            raise ValueError(f"Question {qid} has Vietnamese characters in question.en")
        for idx, opt_en in enumerate(q['options']['en']):
            if check_vietnamese(opt_en):
                raise ValueError(f"Question {qid} has Vietnamese in options.en[{idx}]: {opt_en}")

    print("All 590 new questions passed validation!")

    all_qs = existing_qs + new_qs
    print(f"Combined total questions: {len(all_qs)}")

    # Write to public/data/questions.json
    with open('public/data/questions.json', 'w', encoding='utf-8') as f:
        json.dump(all_qs, f, ensure_ascii=False, indent=2)
    print("Updated public/data/questions.json successfully.")

    # Write to ngan_hang_de.json
    with open('ngan_hang_de.json', 'w', encoding='utf-8') as f:
        json.dump(all_qs, f, ensure_ascii=False, indent=2)
    print("Updated ngan_hang_de.json successfully.")

    # Update quiz_data.js for backwards compatibility
    # Read quiz_data.js up to const quizData = [ ... ];
    # We can reconstruct quiz_data.js properly.
    update_quiz_data_js(new_qs, len(existing_qs))

def update_quiz_data_js(new_qs, existing_count):
    # Mapping topicId to metadata for legacy quiz_data.js
    topic_map = {
        "objects_classes": ("Objects and Classes", "Objects & Classes", "📦"),
        "encapsulation": ("Encapsulation (Tính Đóng Gói & Access Modifiers)", "Encapsulation", "🔒"),
        "inheritance": ("Inheritance (Tính Kế Thừa)", "Inheritance", "🧬"),
        "polymorphism": ("Polymorphism (Tính Đa Hình & Overriding)", "Polymorphism", "🎭"),
        "abstraction": ("Abstraction (Tính Trừu Tượng & Abstract Class)", "Abstraction", "🌫️"),
        "interface": ("Interface (Giao Diện & Default Methods)", "Interface", "🔌"),
        "lambda": ("Lambda Expressions & Functional Interface", "Lambda", "λ"),
        "inner_class": ("Inner Class & Nested Class (Lớp lồng nhau)", "Inner Class", "🪆"),
        "exception": ("Exception Handling (Xử Lý Ngoại Lệ)", "Exception", "🛡️")
    }

    legacy_new_items = []
    for i, q in enumerate(new_qs):
        tid = q['topicId']
        tinfo = topic_map.get(tid, ("OOP Topic", "OOP", "☕"))
        correct_idx = q['correctIndex']
        correct_text = q['options']['vi'][correct_idx]

        item = {
            "id": existing_count + i + 1,
            "bank_id": q['id'],
            "category": q['category']['vi'],
            "topicId": tid,
            "topicName": tinfo[0],
            "topicShortName": tinfo[1],
            "topicIcon": tinfo[2],
            "question": q['question']['vi'],
            "codeSnippet": q['codeSnippet'],
            "image": None,
            "options": q['options']['vi'],
            "correctIndex": correct_idx,
            "correct_text": correct_text,
            "explanation": q['explanation']['vi']
        }
        legacy_new_items.append(item)

    # Read current quiz_data.js
    with open('quiz_data.js', 'r', encoding='utf-8') as f:
        content = f.read()

    marker = "const QUIZ_DATA = "
    pos = content.find(marker)
    if pos != -1:
        print("Appending new items to quiz_data.js...")
        array_str = content[pos + len(marker):].strip()
        if array_str.endswith(';'):
            array_str = array_str[:-1].strip()
        existing_legacy = json.loads(array_str)
        print(f"Parsed {len(existing_legacy)} items from existing quiz_data.js")

        combined_legacy = existing_legacy + legacy_new_items
        print(f"Total legacy items: {len(combined_legacy)}")

        # Updated TOPICS_CONFIG list for legacy
        cfg_start = content.find("const TOPICS_CONFIG = [")
        cfg_end = content.find("];\n\nconst QUIZ_DATA = ")
        
        legacy_topics = json.loads(content[cfg_start + len("const TOPICS_CONFIG = "):cfg_end + 1])
        existing_topic_ids = set(t["id"] for t in legacy_topics)
        
        new_topics = [
            {"id": "objects_classes", "name": "Objects and Classes (Lớp và Đối tượng)", "shortName": "Objects & Classes", "icon": "📦"},
            {"id": "lambda", "name": "Lambda Expressions & Functional Interface", "shortName": "Lambda", "icon": "λ"},
            {"id": "inner_class", "name": "Inner Class & Nested Class (Lớp lồng nhau)", "shortName": "Inner Class", "icon": "🪆"}
        ]
        for nt in new_topics:
            if nt["id"] not in existing_topic_ids:
                legacy_topics.append(nt)

        header = f"// NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM JAVA ONLINE (TỔNG HỢP {len(combined_legacy)} CÂU)\n"
        topics_config_part = f"const TOPICS_CONFIG = {json.dumps(legacy_topics, ensure_ascii=False, indent=2)};\n\n"
        new_quiz_data_str = f"const QUIZ_DATA = {json.dumps(combined_legacy, ensure_ascii=False, indent=2)};\n"

        with open('quiz_data.js', 'w', encoding='utf-8') as f:
            f.write(header + topics_config_part + new_quiz_data_str)
        print("Updated quiz_data.js successfully.")

if __name__ == "__main__":
    main()
