import { db } from "../db";
import { collections, products } from "../../../../drizzle/schema";

async function seedProducts() {
  console.log("🌱 Seeding products...");

  try {
    // Koleksiyonları oluştur
    console.log("Creating collections...");
    
    const [minimalCollection] = await db
      .insert(collections)
      .values({
        name: "Minimal Seri",
        slug: "minimal-seri",
        description: "Sade ve zarif tasarımlar. Minimalist estetiği seven herkes için.",
        imageUrl: "/images/02-minimal-seri-banner.png",
        displayOrder: 1,
        isActive: true,
      })
      .onDuplicateKeyUpdate({
        set: { name: "Minimal Seri" },
      });

    const [luxuryCollection] = await db
      .insert(collections)
      .values({
        name: "Lüks Seri",
        slug: "luks-seri",
        description: "Premium malzemeler ve sofistike kokular. Özel anlar için.",
        imageUrl: "/images/03-luks-seri-banner.png",
        displayOrder: 2,
        isActive: true,
      })
      .onDuplicateKeyUpdate({
        set: { name: "Lüks Seri" },
      });

    console.log("✅ Collections created");

    // Minimal Seri Ürünleri
    console.log("Creating Minimal Series products...");

    await db.insert(products).values([
      {
        name: "Lavender Dreams",
        nameTr: "Lavanta Rüyası",
        slug: "lavender-dreams",
        description: "Calming lavender scent with vanilla notes. Perfect for relaxation and meditation.",
        descriptionTr: "Vanilya notalarıyla sakinleştirici lavanta kokusu. Rahatlama ve meditasyon için mükemmel.",
        price: 299.00,
        stockQuantity: 50,
        imageUrl: "/images/02-minimal-seri-banner.png",
        collectionId: minimalCollection.insertId,
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Ocean Breeze",
        nameTr: "Okyanus Esintisi",
        slug: "ocean-breeze",
        description: "Fresh ocean scent with hints of sea salt and citrus. Brings the beach to your home.",
        descriptionTr: "Deniz tuzu ve narenciye notalarıyla taze okyanus kokusu. Plajı evinize getirir.",
        price: 299.00,
        stockQuantity: 45,
        imageUrl: "/images/02-minimal-seri-banner.png",
        collectionId: minimalCollection.insertId,
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Citrus Burst",
        nameTr: "Narenciye Patlaması",
        slug: "citrus-burst",
        description: "Energizing blend of orange, lemon, and grapefruit. Perfect for morning rituals.",
        descriptionTr: "Portakal, limon ve greyfurt'un enerjik karışımı. Sabah ritüelleri için mükemmel.",
        price: 299.00,
        stockQuantity: 40,
        imageUrl: "/images/02-minimal-seri-banner.png",
        collectionId: minimalCollection.insertId,
        isActive: true,
        isFeatured: false,
      },
    ]);

    console.log("✅ Minimal Series products created");

    // Lüks Seri Ürünleri
    console.log("Creating Luxury Series products...");

    await db.insert(products).values([
      {
        name: "Amber Glow",
        nameTr: "Kehribar Işıltısı",
        slug: "amber-glow",
        description: "Warm amber with sandalwood and musk. Luxurious and sophisticated scent.",
        descriptionTr: "Sandal ağacı ve misk ile sıcak kehribar. Lüks ve sofistike koku.",
        price: 399.00,
        stockQuantity: 30,
        imageUrl: "/images/03-luks-seri-banner.png",
        collectionId: luxuryCollection.insertId,
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Rose Garden",
        nameTr: "Gül Bahçesi",
        slug: "rose-garden",
        description: "Premium rose petals with jasmine and peony. Romantic and elegant.",
        descriptionTr: "Yasemin ve şakayık ile premium gül yaprakları. Romantik ve zarif.",
        price: 399.00,
        stockQuantity: 25,
        imageUrl: "/images/03-luks-seri-banner.png",
        collectionId: luxuryCollection.insertId,
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Firewood & Vanilla",
        nameTr: "Odun Ateşi & Vanilya",
        slug: "firewood-vanilla",
        description: "Smoky firewood with sweet vanilla and cinnamon. Cozy winter nights.",
        descriptionTr: "Tatlı vanilya ve tarçın ile dumanlı odun ateşi. Sıcak kış geceleri.",
        price: 399.00,
        stockQuantity: 35,
        imageUrl: "/images/03-luks-seri-banner.png",
        collectionId: luxuryCollection.insertId,
        isActive: true,
        isFeatured: false,
      },
    ]);

    console.log("✅ Luxury Series products created");
    console.log("🎉 Seeding completed successfully!");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seedProducts()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
