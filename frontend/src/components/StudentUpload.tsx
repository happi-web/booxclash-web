import React, { useState, useEffect } from "react";
import axios from "axios";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type Pathway = {
  _id?: string;
  title: string;
  subject: string;
  sections: {
    introduction: string;
    metaphor: string;
    lessonExplanation: string;
    video: string;
    guidedPractice: string;
    quiz: QuizQuestion[];
    simulation: string;
    references: string[];
  };
};

const StudentUpload = () => {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [quizText, setQuizText] = useState("");
  const [form, setForm] = useState<Pathway>({
    title: "",
    subject: "",
    sections: {
      introduction: "",
      metaphor: "",
      lessonExplanation: "",
      video: "",
      guidedPractice: "",
      quiz: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }],
      simulation: "",
      references: [""],
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPathways();
  }, []);

  const fetchPathways = async () => {
    const res = await axios.get<Pathway[]>("http://localhost:4000/api/pathways");
    setPathways(res.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (
    section: keyof Pathway["sections"],
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;

    if (section === "references") {
      setForm((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          references: value.split(",").map((ref) => ref.trim()),
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          [section]: value,
        },
      }));
    }
  };

  const handleQuizChange = (index: number, field: keyof QuizQuestion, value: string) => {
    const newQuiz = [...form.sections.quiz];
    if (field === "options") {
      newQuiz[index].options = value.split(",");
    } else {
      newQuiz[index][field] = value;
    }

    setForm((prev) => ({
      ...prev,
      sections: { ...prev.sections, quiz: newQuiz },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(`http://localhost:4000/api/pathways/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:4000/api/pathways", form);
    }

    fetchPathways();
    resetForm();
  };

  const handleEdit = (pathway: Pathway) => {
    setForm(pathway);
    setEditingId(pathway._id || null);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:4000/api/pathways/${id}`);
    fetchPathways();
  };

  const resetForm = () => {
    setForm({
      title: "",
      subject: "",
      sections: {
        introduction: "",
        metaphor: "",
        lessonExplanation: "",
        video: "",
        guidedPractice: "",
        quiz: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }],
        simulation: "",
        references: [""],
      },
    });
  };

  const parseQuizText = (text: string) => {
    const questionsArray = text
      .trim()
      .split("\n\n") // Each question block is separated by a blank line
      .map((block) => {
        const lines = block.split("\n").map((line) => line.trim());
        if (lines.length < 3) return null; // Ensure enough lines exist
  
        return {
          question: lines[0], // First line is the question
          options: lines.slice(1, -1), // Middle lines are options
          correctAnswer: lines[lines.length - 1], // Last line is the correct answer
        };
      })
      .filter(Boolean) as QuizQuestion[];
  
    setForm((prev) => ({
      ...prev,
      sections: { ...prev.sections, quiz: questionsArray },
    }));
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">{editingId ? "Edit Pathway" : "Admin Dashboard"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title and Subject */}
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" />

        <label>Subject</label>
        <input name="subject" value={form.subject} onChange={handleChange} className="w-full p-2 border rounded" />

        {/* Sections */}
        <label>Introduction</label>
        <textarea name="introduction" value={form.sections.introduction} onChange={(e) => handleSectionChange("introduction", e)} className="w-full p-2 border rounded" />

        <label>Metaphor</label>
        <textarea name="metaphor" value={form.sections.metaphor} onChange={(e) => handleSectionChange("metaphor", e)} className="w-full p-2 border rounded" />

        <label>Lesson Explanation</label>
        <textarea name="lessonExplanation" value={form.sections.lessonExplanation} onChange={(e) => handleSectionChange("lessonExplanation", e)} className="w-full p-2 border rounded" />

        <label>Video URL</label>
        <input name="video" value={form.sections.video} onChange={(e) => handleSectionChange("video", e)} className="w-full p-2 border rounded" />

        <label>Guided Practice</label>
        <textarea name="guidedPractice" value={form.sections.guidedPractice} onChange={(e) => handleSectionChange("guidedPractice", e)} className="w-full p-2 border rounded" />

        <label>Simulation</label>
        <input name="simulation" value={form.sections.simulation} onChange={(e) => handleSectionChange("simulation", e)} className="w-full p-2 border rounded" />

        {/* References */}
        <label>References</label>
        <input name="references" value={form.sections.references.join(", ")} onChange={(e) => handleSectionChange("references", e)} className="w-full p-2 border rounded" />

        {/* Quiz */}
        <label>Quiz Questions (Paste in format)</label>
      <textarea
        className="w-full p-2 border rounded"
        value={quizText}
        onChange={(e) => setQuizText(e.target.value)}
        placeholder={`Question 1?
Option A
Option B
Option C
Option D
Correct Answer

Question 2?
Option A
Option B
Option C
Option D
Correct Answer`}
      ></textarea>
      <button
        type="button"
        className="bg-green-500 text-white p-2 rounded"
        onClick={() => parseQuizText(quizText)}
      >
        Convert to Quiz
      </button>

      {/* Preview Parsed Quiz */}
      <h3 className="font-bold">Preview Quiz</h3>
      {form.sections.quiz.map((q, index) => (
        <div key={index} className="p-3 border rounded">
          <p><strong>Q{index + 1}:</strong> {q.question}</p>
          <ul>
            {q.options.map((option, idx) => (
              <li key={idx}>{option}</li>
            ))}
          </ul>
          <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
        </div>
      ))}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          {editingId ? "Update Pathway" : "Add Pathway"}
        </button>
      </form>

      {/* List of Pathways */}
      <div className="mt-5">
        {pathways.map((p) => (
          <div key={p._id} className="p-4 border rounded">
            <h2 className="text-lg font-bold">{p.title}</h2>
            <p>{p.subject}</p>
            <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
            <button onClick={() => handleDelete(p._id!)} className="bg-red-500 text-white px-3 py-1 rounded ml-2">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentUpload;
