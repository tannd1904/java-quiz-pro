import { TopicConfig } from '../types/question';

export const TOPICS_CONFIG: TopicConfig[] = [
  {
    id: "encapsulation",
    name: {
      vi: "Encapsulation (Tính Đóng Gói & Access Modifiers)",
      en: "Encapsulation & Access Modifiers"
    },
    shortName: {
      vi: "Encapsulation",
      en: "Encapsulation"
    },
    icon: "🔒"
  },
  {
    id: "inheritance",
    name: {
      vi: "Inheritance (Tính Kế Thừa)",
      en: "Inheritance"
    },
    shortName: {
      vi: "Inheritance",
      en: "Inheritance"
    },
    icon: "🧬"
  },
  {
    id: "polymorphism",
    name: {
      vi: "Polymorphism (Tính Đa Hình & Overriding)",
      en: "Polymorphism & Overriding"
    },
    shortName: {
      vi: "Polymorphism",
      en: "Polymorphism"
    },
    icon: "🎭"
  },
  {
    id: "abstraction",
    name: {
      vi: "Abstraction (Tính Trừu Tượng & Abstract Class)",
      en: "Abstraction & Abstract Classes"
    },
    shortName: {
      vi: "Abstraction",
      en: "Abstraction"
    },
    icon: "🌫️"
  },
  {
    id: "interface",
    name: {
      vi: "Interface (Giao Diện & Default Methods)",
      en: "Interfaces & Default Methods"
    },
    shortName: {
      vi: "Interface",
      en: "Interface"
    },
    icon: "🔌"
  },
  {
    id: "constructor",
    name: {
      vi: "Constructor (Hàm Tạo & Khởi Tạo Đối Tượng)",
      en: "Constructors & Initialization"
    },
    shortName: {
      vi: "Constructor",
      en: "Constructor"
    },
    icon: "🏗️"
  },
  {
    id: "static_final",
    name: {
      vi: "Static & Final (Từ Khóa Tĩnh & Bất Biến)",
      en: "Static & Final Keywords"
    },
    shortName: {
      vi: "Static & Final",
      en: "Static & Final"
    },
    icon: "⚡"
  },
  {
    id: "exception",
    name: {
      vi: "Exception Handling (Xử Lý Ngoại Lệ)",
      en: "Exception Handling"
    },
    shortName: {
      vi: "Exception",
      en: "Exception"
    },
    icon: "🛡️"
  },
  {
    id: "memory_jvm",
    name: {
      vi: "Memory Model & GC (JVM, Stack vs Heap)",
      en: "JVM Memory Model & GC"
    },
    shortName: {
      vi: "Memory & JVM",
      en: "Memory & JVM"
    },
    icon: "💾"
  },
  {
    id: "collections",
    name: {
      vi: "Collections Framework & Generics",
      en: "Collections Framework & Generics"
    },
    shortName: {
      vi: "Collections",
      en: "Collections"
    },
    icon: "📦"
  },
  {
    id: "design_patterns",
    name: {
      vi: "Design Patterns & SOLID Principles",
      en: "Design Patterns & SOLID"
    },
    shortName: {
      vi: "Design Patterns & SOLID",
      en: "Design Patterns & SOLID"
    },
    icon: "📐"
  },
  {
    id: "string",
    name: {
      vi: "String & Immutability (Chuỗi Ký Tự)",
      en: "String & Immutability"
    },
    shortName: {
      vi: "String",
      en: "String"
    },
    icon: "🔤"
  },
  {
    id: "arrays",
    name: {
      vi: "Arrays (Mảng Dữ Liệu)",
      en: "Arrays"
    },
    shortName: {
      vi: "Arrays",
      en: "Arrays"
    },
    icon: "📊"
  },
  {
    id: "io_scanner",
    name: {
      vi: "I/O & Scanner (Nhập Xuất Dữ Liệu)",
      en: "I/O & Scanner Class"
    },
    shortName: {
      vi: "I/O & Scanner",
      en: "I/O & Scanner"
    },
    icon: "⌨️"
  },
  {
    id: "control_flow",
    name: {
      vi: "Control Flow (Vòng Lặp & Rẽ Nhánh)",
      en: "Control Flow & Loops"
    },
    shortName: {
      vi: "Control Flow",
      en: "Control Flow"
    },
    icon: "🔁"
  },
  {
    id: "core_java",
    name: {
      vi: "Core Java (Căn Bản & Tổng Hợp)",
      en: "Core Java & Fundamentals"
    },
    shortName: {
      vi: "Core Java",
      en: "Core Java"
    },
    icon: "☕"
  }
];

export const TOPIC_PRESETS = {
  ALL: TOPICS_CONFIG.map(t => t.id),
  CORE_OOP_6: ['encapsulation', 'inheritance', 'polymorphism', 'abstraction', 'interface', 'constructor'],
  OOP_4: ['encapsulation', 'inheritance', 'polymorphism', 'abstraction'],
  ADVANCED_JVM: ['static_final', 'exception', 'memory_jvm', 'collections', 'design_patterns'],
  CORE_SYNTAX: ['string', 'arrays', 'io_scanner', 'control_flow', 'core_java']
};
