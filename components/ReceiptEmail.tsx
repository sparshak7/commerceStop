import {Text} from "@react-email/text"
import {Img} from "@react-email/img"
import {Container} from "@react-email/container"
import {Section} from "@react-email/section"
import {Preview} from "@react-email/preview"
import {Tailwind} from "@react-email/tailwind"
import {Head} from "@react-email/head"
import {Html} from "@react-email/html"
import {Body} from "@react-email/body"

type ReceiptEmailProps = {
  total: number;
  email: string;
  name: string;
  quantity: string;
  productName: string;
  image: string;
}

export default function ReceiptEmail({total, email, name, quantity, productName, image }: ReceiptEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Receipt email sent to {email} from CommerceStop</Preview>
      <Tailwind>
        <Body className="bg-white font-sans px-2 h-screen flex justify-center items-center overflow-hidden">
          <Container style={container}>
            <Text className="text-2xl font-semibold">
              Hi,{" "}
              <span className="text-2xl font-semibold text-red-400">
                {name}
              </span>
            </Text>
            <Text className="text-lg text-gray-500">
              Thank you for buying your product from CommerceStop!
            </Text>
            <Section className="w-full flex flex-col gap-1 justify-center mt-6">
              <Container className="mb-4 mt-2">
                <Img src={image} width="200px" height="200px" />
              </Container>
              <Text className="text-lg font-semibold">
                Product name: {productName}
              </Text>
              <Text className="text-lg font-semibold">
                Price paid: ₹
                {new Intl.NumberFormat("en-IN").format(total / 100)}
              </Text>
              <Text className="text-lg font-semibold">
                Quantity: {quantity}
              </Text>
            </Section>
            <Text className="text-lg font-bold">
              Best regards,
              <br />
              CommerceStop.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px"
}