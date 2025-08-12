import TitleText from "@/components/TitleText";
import Container from "@/components/wrapper/Container";
import Layout from "@/components/wrapper/Layout";
import { products } from "@/lib/products";
import { useRouter } from "next/router";

export default function ProductsTestimonialPage() {
  const router = useRouter();

  return (
    <Layout title="Testimoni Produk - Ruang Obat" className="scrollbar-hide">
      <Container className="gap-8">
        <TitleText
          title="Testimoni Produk - Ruang Obat 📝"
          text="Testimoni produk yang tersedia pada Ruang Obat"
        />

        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => {
            const Icon = product.icon;

            return (
              <div
                key={product.code}
                className="grid justify-items-center gap-4 overflow-hidden rounded-xl border-2 border-gray/10 p-8 text-sm hover:cursor-pointer hover:bg-purple/10"
                onClick={() => router.push(`/testimonials/${product.code}`)}
              >
                <div
                  className="flex size-16 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      product.iconColor === "warning"
                        ? "#FBBF24"
                        : product.iconColor === "secondary"
                          ? "#A78BFA"
                          : product.iconColor === "success"
                            ? "#34D399"
                            : product.iconColor === "primary"
                              ? "#6366F1"
                              : product.iconColor === "danger"
                                ? "#F87171"
                                : "#E5E7EB",
                  }}
                >
                  <Icon size={36} weight="duotone" className="text-white" />
                </div>

                <h4 className="text-center font-extrabold text-black">
                  {product.label}
                </h4>
              </div>
            );
          })}
        </div>
      </Container>
    </Layout>
  );
}
