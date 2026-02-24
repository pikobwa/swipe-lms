"use client";
import React, { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type AddCoursePageProps = {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  courses: any[];
  setCourses: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function AddCoursePage({ categories, setCategories, courses, setCourses }: AddCoursePageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0] || "Technology");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  type QuizType =
    | { type: 'multiple-choice'; question: string; options: string[]; answer: number }
    | { type: 'multiple-select'; question: string; options: string[]; answers: number[] }
    | { type: 'true-false'; question: string; answer: boolean }
    | { type: 'short-answer'; question: string; expected?: string }
    | { type: 'file-upload'; question: string };

  type TopicType = {
    title: string;
    content: string;
    videoUrl?: string;
    files?: FileList | null;
    images?: FileList | null;
    quiz?: QuizType | null;
    scorm?: File | null;
  };

  const [topics, setTopics] = useState<TopicType[]>([
    { title: "", content: "", videoUrl: "", files: null, images: null, quiz: null, scorm: null }
  ]);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Helper for sortable items
  function SortableTopic({ id, children }: { id: string, children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 10 : undefined,
      opacity: isDragging ? 0.7 : 1,
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  }
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // Add course to parent state
    setCourses([
      ...courses,
      {
        title,
        description,
        category,
        thumbnail,
        topics,
        status: "Draft",
        students: 0,
      },
    ]);
    // Optionally reset form
    setTitle("");
    setDescription("");
    setCategory(categories[0] || "Technology");
    setThumbnail(null);
    setTopics([{ title: "", content: "", videoUrl: "", files: null, images: null, quiz: null, scorm: null }]);
  }

  function handleTopicChange(idx: number, field: 'title' | 'content', value: string) {
    setTopics(topics => topics.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  }

  function handleTopicFileChange(idx: number, files: FileList | null) {
    setTopics(topics => topics.map((t, i) => i === idx ? { ...t, files } : t));
  }
  function handleTopicVideoChange(idx: number, value: string) {
    setTopics(topics => topics.map((t, i) => i === idx ? { ...t, videoUrl: value } : t));
  }
  function handleTopicImageChange(idx: number, files: FileList | null) {
    setTopics(topics => topics.map((t, i) => i === idx ? { ...t, images: files } : t));
  }
  function handleTopicQuizChange(idx: number, quiz: QuizType) {
    setTopics(topics => topics.map((t, i) => i === idx ? { ...t, quiz } : t));
  }
  function handleTopicScormChange(idx: number, file: File | null) {
    setTopics(topics => topics.map((t, i) => i === idx ? { ...t, scorm: file } : t));
  }

  function addTopic() {
    setTopics([...topics, { title: "", content: "", videoUrl: "", files: null, images: null, quiz: null, scorm: null }]);
  }

  function removeTopic(idx: number) {
    setTopics(topics => topics.length > 1 ? topics.filter((_, i) => i !== idx) : topics);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center py-10">
      <form
        className="bg-white rounded-3xl shadow-2xl border border-blue-100 p-10 w-full max-w-3xl flex flex-col gap-10"
        onSubmit={handleSubmit}
      >
        {/* Course Info Section */}
        <div className="flex flex-col gap-6 border-b border-blue-100 pb-8">
          <h2 className="text-2xl font-extrabold text-blue-900 mb-2">Course Info</h2>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Course Title</label>
            <input
              className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Description</label>
            <textarea
              className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Category</label>
            <select
              className="px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              className="px-2 py-1 border border-blue-200 rounded-lg"
              onChange={e => setThumbnail(e.target.files?.[0] || null)}
            />
            {thumbnail && (
              <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail preview" className="w-32 h-20 object-cover rounded mt-2 border" />
            )}
          </div>
        </div>
        {/* Topics Section */}
        <div className="flex flex-col gap-6 border-b border-blue-100 pb-8">
          <h2 className="text-2xl font-extrabold text-blue-900 mb-2">Topics <span className="text-xs text-blue-400">(Drag to reorder)</span></h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={e => {
              const { active, over } = e;
              if (active.id !== over?.id) {
                const oldIdx = topics.findIndex((_, i) => `topic-${i}` === active.id);
                const newIdx = topics.findIndex((_, i) => `topic-${i}` === over?.id);
                setTopics(arrayMove(topics, oldIdx, newIdx));
              }
            }}
          >
            <SortableContext items={topics.map((_, i) => `topic-${i}`)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-4">
                {topics.map((topic, idx) => (
                  <SortableTopic key={idx} id={`topic-${idx}`}>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col gap-4 relative shadow-sm">
                <div className="flex gap-2 items-center">
                  <input
                    className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={topic.title}
                    onChange={e => handleTopicChange(idx, 'title', e.target.value)}
                    placeholder={`Topic Title ${idx + 1}`}
                    required
                  />
                  {topics.length > 1 && (
                    <button type="button" className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200" onClick={() => removeTopic(idx)}>
                      Remove
                    </button>
                  )}
                  <span className="cursor-move text-blue-300 absolute right-4 top-4" title="Drag to reorder">↕</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-blue-700">Topic Content (text)</label>
                  <textarea
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={topic.content}
                    onChange={e => handleTopicChange(idx, 'content', e.target.value)}
                    placeholder="Topic Content"
                    rows={3}
                    required
                  />
                </div>
                {/* Video */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-blue-700">Video Link (YouTube/Vimeo)</label>
                  <input
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={topic.videoUrl || ''}
                    onChange={e => handleTopicVideoChange(idx, e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                  {topic.videoUrl && (
                    <div className="mt-2">
                      <iframe
                        src={topic.videoUrl.replace("watch?v=", "embed/")}
                        title={`Topic ${idx + 1} Video Preview`}
                        className="w-full h-40 rounded border"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
                {/* Images */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-blue-700">Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="px-2 py-1 border border-blue-200 rounded-lg"
                    onChange={e => handleTopicImageChange(idx, e.target.files)}
                  />
                  {topic.images && (
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {Array.from(topic.images).map((file, fidx) => (
                        <img key={fidx} src={URL.createObjectURL(file)} alt="Preview" className="w-16 h-12 object-cover rounded border" />
                      ))}
                    </div>
                  )}
                </div>
                {/* SCORM */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-blue-700">SCORM Package (zip, optional)</label>
                  <input
                    type="file"
                    accept=".zip,application/zip"
                    className="px-2 py-1 border border-blue-200 rounded-lg"
                    onChange={e => handleTopicScormChange(idx, e.target.files?.[0] || null)}
                  />
                  {topic.scorm && (
                    <span className="text-xs text-blue-700 mt-1">{topic.scorm.name}</span>
                  )}
                </div>
                {/* Supporting Files */}
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-blue-700">Supporting Files (PDF, PPT, DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    multiple
                    className="px-2 py-1 border border-blue-200 rounded-lg"
                    onChange={e => handleTopicFileChange(idx, e.target.files)}
                  />
                  {topic.files && (
                    <ul className="text-xs text-blue-700 mt-1">
                      {Array.from(topic.files).map((file, fidx) => (
                        <li key={fidx}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Quiz */}
                <div className="flex flex-col gap-2 bg-blue-100 rounded p-3 mt-2">
                  <label className="font-semibold text-blue-700">Quiz (optional)</label>
                  <select
                    className="px-3 py-2 border border-blue-200 rounded-lg mb-2"
                    value={topic.quiz?.type || 'multiple-choice'}
                    onChange={e => {
                      const type = e.target.value as QuizType['type'];
                      let quiz: QuizType;
                      if (type === 'multiple-choice') quiz = { type, question: '', options: ["", "", "", ""], answer: 0 };
                      else if (type === 'multiple-select') quiz = { type, question: '', options: ["", "", "", ""], answers: [] };
                      else if (type === 'true-false') quiz = { type, question: '', answer: true };
                      else if (type === 'short-answer') quiz = { type, question: '', expected: '' };
                      else quiz = { type, question: '' };
                      handleTopicQuizChange(idx, quiz);
                    }}
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="multiple-select">Multiple Select</option>
                    <option value="true-false">True/False</option>
                    <option value="short-answer">Short Answer</option>
                    <option value="file-upload">File Upload</option>
                  </select>
                  {/* Question Text */}
                  <input
                    className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-1"
                    value={topic.quiz?.question || ''}
                    onChange={e => topic.quiz && handleTopicQuizChange(idx, { ...topic.quiz, question: e.target.value })}
                    placeholder="Quiz Question"
                  />
                  {/* Multiple Choice */}
                  {topic.quiz && (!topic.quiz.type || topic.quiz.type === 'multiple-choice') && topic.quiz.type === 'multiple-choice' && (() => {
                    const quiz = topic.quiz;
                    return (
                      <>
                        {[0,1,2,3].map(optIdx => (
                          <div key={optIdx} className="flex items-center gap-2 mb-1">
                            <input
                              className="flex-1 px-2 py-1 border border-blue-200 rounded"
                              value={quiz.options[optIdx] || ''}
                              onChange={e => {
                                const options = [...quiz.options];
                                options[optIdx] = e.target.value;
                                handleTopicQuizChange(idx, { ...quiz, options });
                              }}
                              placeholder={`Option ${optIdx + 1}`}
                            />
                            <input
                              type="radio"
                              name={`answer-${idx}`}
                              checked={quiz.answer === optIdx}
                              onChange={() => handleTopicQuizChange(idx, { ...quiz, answer: optIdx })}
                            />
                            <span className="text-xs text-blue-700">Correct</span>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                  {/* Multiple Select */}
                  {topic.quiz && topic.quiz.type === 'multiple-select' && (() => {
                    const quiz = topic.quiz;
                    return (
                      <>
                        {[0,1,2,3].map(optIdx => (
                          <div key={optIdx} className="flex items-center gap-2 mb-1">
                            <input
                              className="flex-1 px-2 py-1 border border-blue-200 rounded"
                              value={quiz.options[optIdx] || ''}
                              onChange={e => {
                                const options = [...quiz.options];
                                options[optIdx] = e.target.value;
                                handleTopicQuizChange(idx, { ...quiz, options });
                              }}
                              placeholder={`Option ${optIdx + 1}`}
                            />
                            <input
                              type="checkbox"
                              checked={quiz.answers.includes(optIdx)}
                              onChange={e => {
                                let answers = [...quiz.answers];
                                if (e.target.checked) {
                                  answers.push(optIdx);
                                } else {
                                  answers = answers.filter(a => a !== optIdx);
                                }
                                handleTopicQuizChange(idx, { ...quiz, answers });
                              }}
                            />
                            <span className="text-xs text-blue-700">Correct</span>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                  {/* True/False */}
                  {topic.quiz && topic.quiz.type === 'true-false' && (
                    <div className="flex gap-4 mb-1">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`tf-${idx}`}
                          checked={topic.quiz.answer === true}
                          onChange={() => handleTopicQuizChange(idx, { ...topic.quiz, answer: true } as typeof topic.quiz)}
                        />
                        True
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name={`tf-${idx}`}
                          checked={topic.quiz.answer === false}
                          onChange={() => handleTopicQuizChange(idx, { ...topic.quiz, answer: false } as typeof topic.quiz)}
                        />
                        False
                      </label>
                    </div>
                  )}
                  {/* Short Answer */}
                  {topic.quiz && topic.quiz.type === 'short-answer' && (
                    <input
                      className="px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-1"
                      placeholder="Expected answer (optional)"
                      value={topic.quiz.expected || ''}
                      onChange={e => handleTopicQuizChange(idx, { ...topic.quiz, expected: e.target.value } as typeof topic.quiz)}
                    />
                  )}
                  {/* File Upload */}
                  {topic.quiz && topic.quiz.type === 'file-upload' && (
                    <div className="flex flex-col gap-2">
                      <label className="text-blue-700 text-sm">Student will upload a file as their answer.</label>
                    </div>
                  )}
                </div>
                    </div>
                  </SortableTopic>
                ))}
                <button type="button" className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 w-fit" onClick={addTopic}>
                  + Add Topic
                </button>
              </div>
            </SortableContext>
          </DndContext>
  </div>
        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition text-xl mt-2"
        >
          Save Course
        </button>
        {submitted && (
          <div className="text-green-600 font-semibold text-center mt-2">Course submitted! (Demo only)</div>
        )}
      </form>
    </div>
  );
}
