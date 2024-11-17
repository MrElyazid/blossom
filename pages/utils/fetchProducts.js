import { db } from "../../firebaseConfig";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export const fetchProducts = async (skinCondition, skinTypeClass) => {
  try {
    const productsRef = collection(db, "products");
    let q;

    // Build the query based on the available model results (skinCondition, skinTypeClass)
    if (skinCondition && skinTypeClass) {
      q = query(
        productsRef,
        where(skinCondition, ">", 0),
        orderBy(skinCondition, "desc"),
        orderBy(skinTypeClass, "desc"),
        limit(3)
      );
    } else if (skinCondition) {
      q = query(
        productsRef,
        where(skinCondition, ">", 0),
        orderBy(skinCondition, "desc"),
        limit(3)
      );
    } else if (skinTypeClass) {
      q = query(
        productsRef,
        where(skinTypeClass, ">", 0),
        orderBy(skinTypeClass, "desc"),
        limit(3)
      );
    } else {
      throw new Error("No valid model results available");
    }

    const querySnapshot = await getDocs(q);

    // Log the fetched snapshot to inspect its contents
    console.log("Fetched Firestore Snapshot:", querySnapshot);

    const fetchedProducts = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Log the data for each product
      console.log("Product Data:", data);

      const score =
        (skinCondition ? data[skinCondition] || 0 : 0) +
        (skinTypeClass ? data[skinTypeClass] || 0 : 0);
      return {
        id: doc.id,
        ...data,
        compatibility_score: score,
      };
    });

    console.log("Fetched Products:", fetchedProducts);
    return fetchedProducts;
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products: " + error.message);
  }
};
