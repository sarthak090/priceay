import { Product } from "@/models/Products";
import { GetStaticProps } from "next";
import ProductCard from "@/components/ProductCard";

import useTranslation from "next-translate/useTranslation";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import Link from "next/link";

const apiUrl = process.env.NEXT_API_URL;
interface Props {
  productData: Product[];
  meta: any;
}

export default function PerfumeMen(props: Props) {
  const { t } = useTranslation();
  const { locale, query } = useRouter();

  return (
    <>
      <NextSeo
        title={t("common:perfume-men")}
        canonical={process.env.NEXT_PUBLIC_DOMAIN_NAME + "/perfume-men"}
        openGraph={{
          title: t("common:perfume-men"),
          locale,
        }}
      />
      <div className="px-3">
        <p className="text-3xl text-center ">{t("common:perfume-men")}</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 my-8">
          {props.productData.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
      <div className="flex gap-4 my-16 justify-center">
        <div className="px-4 py-3 border">
          <Link href={`1`}>1</Link>
        </div>

        {[
          props.meta.pagination.page,
          props.meta.pagination.page + 1,
          props.meta.pagination.page + 2,
          props.meta.pagination.page + 3,
          props.meta.pagination.page + 4,
        ].map((i) => (
          <>
            {i >= props.meta.pagination.pageCount ? null : (
              <div className="px-4 py-3 border">
                {i == query.slug ? i : <Link href={`${i}`}>{i}</Link>}
              </div>
            )}
          </>
        ))}
        <div className="px-4 py-3 border">
          <Link href={`${props.meta.pagination.pageCount}`}>
            {props.meta.pagination.pageCount}
          </Link>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths(ctx: any) {
  // query Strapi to calculate the total page number
  const { locale } = ctx;

  const reqUrl = `${apiUrl}/products${
    locale == "ar" ? "?locale=ar&" : "?"
  }filters[gender][$eq]=Male&populate=*`;

  const response = await fetch(reqUrl).then((r) => r.json());

  const paths = Array.from(
    { length: response.meta.pagination.pageCount },
    (_, i) => i + 1
  ).map((r) => ({ params: { slug: r.toString() } }));

  return {
    paths,
    fallback: true, // See the "fallback" section in docs
  };
}
export const getStaticProps: GetStaticProps = async (ctx) => {
  const { locale } = ctx;
  const reqUrl = `${apiUrl}/products${
    locale == "ar" ? "?locale=ar&" : "?"
  }filters[gender][$eq]=Male&populate=*&pagination[page]=${ctx.params?.slug}`;

  const response = await fetch(reqUrl).then((r) => r.json());

  return {
    props: {
      productData: response.data,
      meta: response.meta,
    },
  };
};
