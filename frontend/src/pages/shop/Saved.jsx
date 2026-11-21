import Button from "../../components/Button.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import ProductCard from "../../components/ProductCard.jsx";
import { useShop } from "../../context/ShopContext.jsx";

export default function Saved() {
  const { savedProducts, addToCart, addAllSaved } = useShop();

  return (
    <>
      <PageHeader title="Saqlangan">
        <Button onClick={addAllSaved} disabled={savedProducts.length === 0}>
          Hammasini savatga
        </Button>
      </PageHeader>

      <p className="text-sm text-muted">
        Har safar bir xil buyurtma qilsangiz, mahsulotlarni shu yerda saqlang va bir bosishda
        savatga qo'shing.
      </p>

      {savedProducts.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Saqlangan mahsulotlar yo'q</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedProducts.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      )}
    </>
  );
}
