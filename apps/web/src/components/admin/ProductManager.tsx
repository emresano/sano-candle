import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import { Collection, Product } from "../../types";
import { useLanguage } from "../../context/LanguageContext";

type ProductImageForm = {
  id?: number;
  imageUrl: string;
  altText: string;
  displayOrder: string;
};

type ProductForm = {
  id?: number;
  collectionId?: number | "";
  slug: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  descriptionEn: string;
  price: string;
  stock: string;
  imageUrl: string;
  featured: boolean;
  images: ProductImageForm[];
};

const emptyForm: ProductForm = {
  collectionId: "",
  slug: "",
  nameTr: "",
  nameEn: "",
  descriptionTr: "",
  descriptionEn: "",
  price: "0",
  stock: "0",
  imageUrl: "",
  featured: false,
  images: [],
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, collectionsRes] = await Promise.all([
        api.get("/catalog/products"),
        api.get("/catalog/collections"),
      ]);
      setProducts(productsRes.data.data ?? []);
      setCollections(collectionsRes.data.data ?? []);
    } catch (err) {
      console.error(err);
      setError(language === "tr" ? "Veriler yüklenemedi." : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editing = useMemo(() => form.id !== undefined, [form.id]);

  const handleEdit = async (product: Product) => {
    try {
      const response = await api.get(`/catalog/products/${product.id}`);
      const detailedProduct = response.data.data;
      setForm({
        id: detailedProduct.id,
        collectionId: detailedProduct.collectionId ?? "",
        slug: detailedProduct.slug,
        nameTr: detailedProduct.nameTr,
        nameEn: detailedProduct.nameEn,
        descriptionTr: detailedProduct.descriptionTr ?? "",
        descriptionEn: detailedProduct.descriptionEn ?? "",
        price: (detailedProduct.price / 100).toFixed(2),
        stock: String(detailedProduct.stock ?? 0),
        imageUrl: detailedProduct.imageUrl ?? "",
        featured: detailedProduct.featured === 1,
        images: (detailedProduct.images ?? []).map(
          (image: { imageUrl: string; altText?: string | null; displayOrder?: number | null; id?: number }) => ({
            id: image.id,
            imageUrl: image.imageUrl,
            altText: image.altText ?? "",
            displayOrder: image.displayOrder?.toString() ?? "0",
          })
        ),
      });
    } catch (err) {
      console.error(err);
      setError(language === "tr" ? "Ürün detayları getirilemedi." : "Failed to load product details.");
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setError(null);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm(language === "tr" ? "Bu ürünü silmek istediğinize emin misiniz?" : "Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/catalog/products/${productId}`);
      void fetchData();
    } catch (err) {
      console.error(err);
      setError(language === "tr" ? "Ürün silinemedi." : "Product deletion failed.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      collectionId: form.collectionId === "" ? undefined : Number(form.collectionId),
      slug: form.slug,
      nameTr: form.nameTr,
      nameEn: form.nameEn,
      descriptionTr: form.descriptionTr,
      descriptionEn: form.descriptionEn,
      price: Math.round(parseFloat(form.price.replace(",", ".")) * 100),
      stock: Number(form.stock),
      imageUrl: form.imageUrl || undefined,
      featured: form.featured,
      images: form.images
        .filter((img) => img.imageUrl.trim() !== "")
        .map((img, index) => ({
          imageUrl: img.imageUrl,
          altText: img.altText || undefined,
          displayOrder: img.displayOrder ? Number(img.displayOrder) : index,
        })),
    };

    try {
      if (editing && form.id) {
        await api.put(`/catalog/products/${form.id}`, payload);
      } else {
        await api.post("/catalog/products", payload);
      }
      resetForm();
      void fetchData();
    } catch (err) {
      console.error(err);
      setError(language === "tr" ? "Ürün kaydedilemedi." : "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((image, idx) =>
        idx === index ? { ...image, [name]: value } : image
      ),
    }));
  };

  const addImageField = () => {
    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          imageUrl: "",
          altText: "",
          displayOrder: prev.images.length.toString(),
        },
      ],
    }));
  };

  const removeImageField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const formId = "product-form";
  const primaryActionLabel = editing
    ? language === "tr"
      ? "Ürünü Güncelle"
      : "Update Product"
    : language === "tr"
    ? "Ürün Ekle"
    : "Add Product";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-serif font-light text-brand-brown">
          {language === "tr" ? "Ürün Yönetimi" : "Product Management"}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={resetForm}
            type="button"
            className="rounded-full border border-warm-500 px-4 py-2 text-sm font-medium text-warm-600 transition hover:bg-warm-100"
          >
            {language === "tr" ? "Yeni Ürün" : "New Product"}
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
        <div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-3">
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
                ? "Slug, ürünün URL'de kullanılacak kısa ve özel adıdır (ör. \"lavanta-mumu\")."
                : "Slug is the unique part of the URL for this product (e.g. \"lavender-candle\")."}
            </p>
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
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "Koleksiyon" : "Collection"}
          </label>
          <select
            name="collectionId"
            value={form.collectionId}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
          >
            <option value="">{language === "tr" ? "Seçilmedi" : "Unassigned"}</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {language === "tr" ? collection.nameTr : collection.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "Fiyat (TL)" : "Price (TRY)"}
          </label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-brand-brown/60">
            {language === "tr" ? "Stok" : "Stock"}
          </label>
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
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
            {language === "tr" ? "Ürün Görseli" : "Image URL"}
          </label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
          />
          <p className="mt-1 text-xs text-brand-brown/60">
            {language === "tr"
              ? "Yerel bir dosya kullanmak için görseli `apps/web/public/images` içine kopyalayıp URL alanına `/images/dosya-adı.jpg` yazabilirsiniz."
              : "To use a local file, add it under `apps/web/public/images` and enter `/images/file-name.jpg` here."}
          </p>
        </div>

        <div className="md:col-span-2 space-y-4 rounded-2xl border border-brand-tan bg-brand-beige/40 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-brand-brown">
              {language === "tr" ? "Ek Görseller" : "Additional Images"}
            </h3>
            <button
              type="button"
              onClick={addImageField}
              className="rounded-full border border-warm-500 px-4 py-1 text-xs font-medium text-warm-600 transition hover:bg-warm-100"
            >
              {language === "tr" ? "Görsel Ekle" : "Add Image"}
            </button>
          </div>
          {form.images.length === 0 && (
            <p className="text-xs text-brand-brown/60">
              {language === "tr"
                ? "Yeni bir görsel eklemek için yukarıdaki butonu kullanın. Birden fazla görsel ekleyebilirsiniz."
                : "Click the button above to add additional images. You can add multiple URLs."}
            </p>
          )}
          {form.images.map((image, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-3 rounded-xl border border-brand-tan/60 bg-white p-4 md:grid-cols-3"
            >
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase text-brand-brown/60">
                  URL
                </label>
                <input
                  name="imageUrl"
                  value={image.imageUrl}
                  onChange={(event) => handleImageChange(index, event)}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-brand-brown/60">
                  {language === "tr" ? "Sıra" : "Order"}
                </label>
                <input
                  name="displayOrder"
                  type="number"
                  min="0"
                  value={image.displayOrder}
                  onChange={(event) => handleImageChange(index, event)}
                  className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-semibold uppercase text-brand-brown/60">
                  {language === "tr" ? "Alternatif Metin" : "Alt Text"}
                </label>
                <input
                  name="altText"
                  value={image.altText}
                  onChange={(event) => handleImageChange(index, event)}
                  className="mt-2 w-full rounded-2xl border border-brand-tan bg-brand-beige px-3 py-2 text-sm outline-none focus:border-brand-accent"
                  placeholder={language === "tr" ? "Ürün görseli açıklaması" : "Image description"}
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-100"
                >
                  {language === "tr" ? "Kaldır" : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-brand-brown">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-brand-tan text-brand-brown focus:ring-brand-accent"
          />
          {language === "tr" ? "Öne Çıkan" : "Featured"}
        </label>

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
                  {language === "tr" ? "Ürün" : "Product"}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-brown/70">
                  {language === "tr" ? "Fiyat" : "Price"}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-brown/70">
                  {language === "tr" ? "Stok" : "Stock"}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-brown/70">
                  {language === "tr" ? "Durum" : "Status"}
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-tan/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-brand-brown/70">
                    {language === "tr" ? "Yükleniyor..." : "Loading..."}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-brand-beige/40">
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-brown">
                        {language === "tr" ? product.nameTr : product.nameEn}
                      </p>
                      <p className="text-xs text-brand-brown/60">{product.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-brand-brown/80">
                      {(product.price / 100).toFixed(2)} TL
                    </td>
                    <td className="px-4 py-3 text-brand-brown/80">{product.stock}</td>
                    <td className="px-4 py-3 text-brand-brown/80">
                      {product.featured ? (language === "tr" ? "Öne Çıkan" : "Featured") : "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="rounded-full border border-warm-500 px-3 py-1 text-xs font-medium text-warm-600 transition hover:bg-warm-100"
                        >
                          {language === "tr" ? "Düzenle" : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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

