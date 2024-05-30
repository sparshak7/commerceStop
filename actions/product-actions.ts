"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import prisma from "../app/lib/db";
import { notFound, redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { stripe } from "@/utils/stripe";

const fileSchema = z.instanceof(File, { message: "Required." });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(1, { message: "Name must be at least 1 characters long." }),
  description: z
    .string({ required_error: "Description is required." })
    .min(5, { message: "Description must be at least 5 characters long." }),
  categories: z.string({ required_error: "Category is required." }).min(1, {message: "At least one category is required."}),
  price: z.coerce
    .number()
    .int()
    .min(1, { message: "Price must be at least 1." }),
  image: imageSchema.refine((file) => file.size > 0, {
    message: "File size should be more than 0.",
  }),
});

const editSchema = addSchema.extend({
  image: imageSchema.optional(),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  console.log(result)
  if (result.success === false) {
    console.log(result.error.flatten().fieldErrors);
    return result.error.flatten().fieldErrors;
  }
  try {
    const data = result.data;
    const filename = `${Math.random()}-${data.image.name}`;
    const supabase = createServerActionClient({ cookies });
    const { data: imgData } = await supabase.storage
      .from("Zephyr-products")
      .upload(filename, data.image, { cacheControl: "3600", upsert: false });

    const categories = data.categories.split(",").map(c => c.trim())

    if (imgData) {
      const path = imgData.path;

      await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          image: path,
          categories,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
  redirect("/admin/dashboard");
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await prisma.product.update({
    where: { id },
    data: { isAvailableForPurchase },
  });
}

export async function deleteProduct(id: string) {
  const supabase = createServerActionClient({ cookies });
  const product = await prisma.product.findUnique({ where: { id } });
  const { error } = await supabase.storage
    .from("Zephyr-products")
    .remove([`${product?.image}`]);

  if (error) {
    console.log(error);
  }

  const deleteProduct = await prisma.product.delete({ where: { id } });
  if (deleteProduct == null) {
    return notFound();
  }
}

export async function editProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }
  try {
    const data = result.data;
    let filename = "";
    const product = await prisma.product.findUnique({ where: { id } });

    if (product == null) {
      return notFound();
    }

    const categories = data.categories.split(",").map((c) => c.trim());
    const supabase = createServerActionClient({ cookies });

    if (data.image != null && data.image.size > 0) {
      filename = `${Math.random()}-${data.image.name}`;
      const { error: deleteError } = await supabase.storage
        .from("Zephyr-products")
        .remove([`${product?.image}`]);

      if (deleteError) {
        console.log(deleteError);
      }

      const { data: imgData, error } = await supabase.storage
        .from("Zephyr-products")
        .upload(filename, data.image, { cacheControl: "3600", upsert: false });

      if (error) {
        console.log(error);
      }

      if (imgData) {
        const path = imgData.path;

        await prisma.product.update({
          where: { id },
          data: {
            name: data.name,
            description: data.description,
            price: data.price,
            image: path,
            categories,
          },
        });
      }
    } else {
      await prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          categories,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }

  redirect("/admin/dashboard");
}

export async function addToCart(id: string) {
  let flag;
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const existingProduct = await prisma.cart.findFirst({where: {kindeAuth: user?.id as string, productId: id}})

  console.log(existingProduct)

  console.log("Inside")

  if (existingProduct === null) {
    await prisma.cart.create({
      data: {
        kindeAuth: user?.id as string,
        productId: id,
      },
    });
    flag = 0;
  } else {
    await prisma.cart.update({
      where: { id: existingProduct.id },
      data: {
        quantity: existingProduct.quantity + 1,
      },
    });
    flag = 1;
  }

  revalidatePath("/");
  return flag;
}

export async function deleteFromCart(id: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  await prisma.cart.delete({ where: { kindeAuth: user?.id, id } });
  revalidatePath(`/cart/:id`);
}

export async function changeQuantity(id: string, order: string) {
  if (order === "des") {
    await prisma.cart.update({
      where: { id },
      data: { quantity: { decrement: 1 } },
    });
  }
  if (order === "asc") {
    await prisma.cart.update({
      where: { id },
      data: { quantity: { increment: 1 } },
    });
  }
  revalidatePath("/cart/:id")
}

export async function BuyProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const quantity = formData.get("quantity") as string;
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await prisma.product.findUnique({ where: { id }, select: {
    price: true,
    name: true,
    image: true,
  } });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "inr",
          unit_amount: Math.round((data?.price as number) * 100),
          product_data: {
            name: data?.name as string,
            images: [`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${data?.image as string}`],
          },
        },
        quantity: parseInt(quantity),
      },
    ],
    metadata: {
      productId: id,
      userId: user?.id as string,
      quantity,
    },
    success_url: `${process.env.NEXT_PUBLIC_PAYMENT_REDIRECT_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_PAYMENT_REDIRECT_URL}/payment/cancel`,
  });

  return redirect(session.url as string)
}
