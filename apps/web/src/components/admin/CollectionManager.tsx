import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import { Collection } from "../../types";
import { useLanguage } from "../../context/LanguageContext";

type CollectionForm = {
  id?: number;
  slug: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  descriptionEn: string;
  imageUrl: string;
  displayOrder: string;
};

const emptyForm: CollectionForm = {
  slug: "",
  nameTr: "",
  nameEn: "",
  descriptionTr: "",
  descriptionEn: "",
  imageUrl: "",
  displayOrder: "0",
};

export default function CollectionManager() {
  const { language } = useLanguage();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CollectionForm>(emptyForm);

  const editing = useMemo(() => form.id !== undefined, [form.id]);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const response = await api.get("/catalog/collections");
      setCollections(response.data.data ?? []);
    } catch (err) {
      console.error(err);
      setError(language === "tr" ? "Koleksiyonlar yüklenemedi." : "Failed to load collections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setError(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (collection: Collection) => {
    setForm({
      id: collection.id,
      slug: collection.slug,
      nameTr: collection.nameTr,
      nameEn: collection.nameEn,
      descriptionTr: collection.descriptionTr ?? "",
      descriptionEn: collection.descriptionEn ?? "",
      imageUrl: collection.imageUrl ?? "",
      displayOrder: String(collection.displayOrder ?? 0),
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm(language === "tr" ? "Bu koleksiyonu silmek istediğinize emin misiniz?" : "Delete collection?")) {
      return;
    }
    try {
      await api.delete(`/catalog/collections/${id}`);
      if (form.id === id) {
        resetForm();
      }
      void fetchCollections();
    } catch (err) {
      console.error(err);
      setError(language === "tr" ? "Koleksiyon silinemedi." : "Failed to delete collection.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      slug: form.slug,
      nameTr: form.nameTr,
      nameEn: form.nameEn,
      descriptionTr: form.descriptionTr || undefined,
      descriptionEn: form.descriptionEn || undefined,
      imageUrl: form.imageUrl || undefined,
      displayOrder: Number(form.displayOrder) || 0,
    };

    try {
      if (editing && form.id) {
        await api.put(`/catalog/collections/${form.id}`, payload);
      } else {
        await api.post("/catalog/collections", payload);
      }
      resetForm();
      void fetchCollections();
    } catch (err) {
      console.error(err);
      setError(language === "tr" ? "Koleksiyon kaydedilemedi." : "Failed to save collection.");
    } finally {
      setSaving(false);
    }
  };

  const formId = "collection-form";
  const primaryActionLabel = editing
    ? language === "tr"
      ? "Koleksiyonu Güncelle"
      : "Update Collection"
    : language === "tr"
    ? "Koleksiyon Ekle"
    : "Add Collection";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-serif font-light text-brand-brown">
          {language === "tr" ? "Koleksiyon Yönetimi" : "Collection Management"}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={resetForm}
            type="button"
            className="rounded-full border border-warm-500 px-4 py-2 text-sm font-medium text-warm-600 transition hover:bg-warm-100"
          >
            {language === "tr" ? "Yeni Koleksiyon" : "New Collection"}
          </button>
          <button
            type="submit"
            form={formId}
            disabled={saving}
            className="rounded-full bg-warm-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-warm-600 disabled:cursor-not-allowed disabled:bg-warm-300"
          >
            {saving
              ? language === "tr"
                ? "Kaydediliyor..."
                : "Saving..."
              : primaryActionLabel}
          </button>
        </div>
      </div>

      <form
        id={formId}
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <div>
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "Slug" : "Slug"}
          </label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
          />
          <p className="mt-1 text-xs text-brand-brown/60">
            {language === "tr"
              ? "Slug, koleksiyon URL'sinde kullanılacak kısa ve benzersiz ada karşılık gelir (ör. \"minimal\")."
              : "Slug is the unique identifier used in the collection URL (e.g. \"minimal\")."}
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "Sıra" : "Display Order"}
          </label>
          <input
            name="displayOrder"
            type="number"
            min="0"
            value={form.displayOrder}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "Türkçe Ad" : "Name (TR)"}
          </label>
          <input
            name="nameTr"
            value={form.nameTr}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "İngilizce Ad" : "Name (EN)"}
          </label>
          <input
            name="nameEn"
            value={form.nameEn}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "Türkçe Açıklama" : "Description (TR)"}
          </label>
          <textarea
            name="descriptionTr"
            value={form.descriptionTr}
            onChange={handleChange}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "İngilizce Açıklama" : "Description (EN)"}
          </label>
          <textarea
            name="descriptionEn"
            value={form.descriptionEn}
            onChange={handleChange}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "Görsel URL'si" : "Image URL"}
          </label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
          />
        </div>

        {error && <p className="md:col-span-2 text-sm text-red-500">{error}</p>}

        <div className="md:col-span-2 flex items-center gap-3 md:hidden">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-warm-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-warm-600 disabled:cursor-not-allowed disabled:bg-warm-300"
          >
            {saving
              ? language === "tr"
                ? "Kaydediliyor..."
                : "Saving..."
              : primaryActionLabel}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-warm-500 px-6 py-3 text-sm font-medium text-warm-600 transition hover:bg-warm-100"
            >
              {language === "tr" ? "İptal" : "Cancel"}
            </button>
          )}
        </div>

        {editing && (
          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-warm-500 px-6 py-3 text-sm font-medium text-warm-600 transition hover:bg-warm-100"
            >
              {language === "tr" ? "İptal" : "Cancel"}
            </button>
          </div>
        )}
      </form>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="max-h-[400px] overflow-auto">
          <table className="min-w-full divide-y divide-brand-tan/70 text-sm">
            <thead className="bg-brand-beige">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-brand-brown/70">
                  {language === "tr" ? "Koleksiyon" : "Collection"}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-brown/70">
                  {language === "tr" ? "Slug" : "Slug"}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-brown/70">
                  {language === "tr" ? "Sıra" : "Order"}
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-tan/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-brand-brown/70">
                    {language === "tr" ? "Yükleniyor..." : "Loading..."}
                  </td>
                </tr>
              ) : collections.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-brand-brown/70">
                    {language === "tr" ? "Koleksiyon bulunamadı." : "No collections found."}
                  </td>
                </tr>
              ) : (
                collections.map((collection) => (
                  <tr key={collection.id} className="hover:bg-brand-beige/40">
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-brown">
                        {language === "tr" ? collection.nameTr : collection.nameEn}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-brand-brown/80">{collection.slug}</td>
                    <td className="px-4 py-3 text-brand-brown/80">{collection.displayOrder ?? 0}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(collection)}
                          className="rounded-full border border-warm-500 px-3 py-1 text-xs font-medium text-warm-600 transition hover:bg-warm-100"
                        >
                          {language === "tr" ? "Düzenle" : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDelete(collection.id)}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-100"
                        >
                          {language === "tr" ? "Sil" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


