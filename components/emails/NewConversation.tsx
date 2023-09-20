import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VercelInviteUserEmailProps {
  agentName?: string;
  ctaLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const VercelInviteUserEmail = ({
  agentName = '',
  ctaLink = '',
}: VercelInviteUserEmailProps) => {
  const previewText = `New conversation started with Agent ${agentName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto font-sans bg-white">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://www.chatbotgpt.ai/app-logo-icon.png`}
                width="50"
                height="auto"
                alt="Vercel"
                className="mx-auto my-0 "
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              New conversation started with Agent <strong>{agentName}</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello 👋
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              A new conversation has been started with your Agent {agentName}
              <strong>{agentName}</strong>
            </Text>
            {/* <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={userImage}
                    width="64"
                    height="64"
                  />
                </Column>
                <Column align="center">
                  <Img
                    src={`${baseUrl}/static/vercel-arrow.png`}
                    width="12"
                    height="9"
                    alt="invited you to"
                  />
                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={teamImage}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section> */}
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center"
                href={ctaLink}
              >
                View Conversation
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={ctaLink} className="text-blue-600 no-underline">
                {ctaLink}
              </Link>
            </Text>
            {/* <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" /> */}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VercelInviteUserEmail;