import { Product } from "@/models/Products";
import { GetStaticProps } from "next";
import ProductCard from "@/components/ProductCard";
import useTranslation from "next-translate/useTranslation";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const apiUrl = process.env.NEXT_API_URL;
interface Props {
  productData: Product[];
}
export default function PerfumeUnisex(props: Props) {
  const { t } = useTranslation();
  const { locale } = useRouter();

  return (
    <>
      <NextSeo
        title={t("common:perfume-unisex")}
        canonical={process.env.NEXT_PUBLIC_DOMAIN_NAME + "/perfume-unisex"}
        openGraph={{
          title: t("common:perfume-unisex"),
          locale,
        }}
      />
      <div className="px-3">
        <p className="text-3xl text-center">{t("common:perfume-unisex")}</p>

        <div className="grid md:grid-cols-4 grid-cols-2 my-8">
          {props.productData.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;

  const reqUrl = `${apiUrl}/products${
    locale == "ar" ? "?locale=ar&" : "?"
  }filters[gender][$eq]=Unisex&populate=*`;

  const response = await fetch(reqUrl).then((r) => r.json());

  return {
    props: {
      productData: response.data,
    },
  };
};
