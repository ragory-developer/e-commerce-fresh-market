"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  const [loading, setLoading] = useState(false);
  const [pageId, setPageId] = useState("");
  const [fetching, setFetching] = useState(true);
  const [slugError, setSlugError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    status: "draft",
    content: ""
  });

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pages/${slug}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPageId(json.data.id);
        setFormData({
          title: json.data.title || "",
          slug: json.data.slug || "",
          status: json.data.status || "draft",
          content: json.data.content || ""
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  // Central Slug Checking
  useEffect(() => {
    if (!formData.slug || !pageId) {
      setSlugError("");
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/check-slug?slug=${formData.slug}&excludeId=${pageId}`);
        const data = await res.json();
        if (data.success && !data.available) {
          setSlugError("This URL slug is already taken by an existing Product, Category, or Page.");
        } else {
          setSlugError("");
        }
      } catch(e) {}
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.slug, pageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugError) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('freshcart_access_token') || localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        alert("Page updated!");
        router.push('/admin/pages');
      } else {
        alert(json.message || "Failed to update page");
      }
    } catch (e) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeft size={20} className="text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Page</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Page Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 text-lg font-semibold rounded-xl border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Page Content
            </label>
            <div className="rounded-xl overflow-hidden border border-gray-300 bg-white text-gray-900">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(val) => setFormData({ ...formData, content: val })}
                className="h-[400px] mb-12 text-gray-900 [&_.ql-editor]:text-gray-900 [&_.ql-editor]:min-h-[300px]"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image', 'video'],
                    ['clean']
                  ],
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <div className={`flex items-center rounded-xl overflow-hidden border ${slugError ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}>
              <span className="px-4 py-2 bg-gray-100 border-r border-gray-300 text-gray-600 text-sm">
                /
              </span>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-white text-gray-900 outline-none transition-all"
              />
            </div>
            {slugError && <p className="mt-2 text-sm font-semibold text-red-500">{slugError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Visibility Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="draft">Draft (Hidden)</option>
              <option value="published">Published (Visible)</option>
            </select>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
            <Link
              href="/admin/pages"
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !!slugError}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "Saving..." : <><Save size={18} /> Update Page</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
