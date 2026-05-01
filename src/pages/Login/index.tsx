import {
  Button,
  Card,
  Checkbox,
  Container,
  Image,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PhotoCredit } from "../../components/PhotoCredit";
import SimpleFooter from "../../components/SimpleFooter";
import { ThemeToggle } from "../../components/ThemeToggle";
import {
  createSmoothTextContainerMotionProps,
  createSmoothTextItemMotionProps,
} from "../../config/motion";
import { useAuth } from "../../hooks/auth";
import { useColorScheme } from "../../hooks/useColorScheme";
import styles from "./style.module.css";

export const Login = () => {
  const { user, signInWithGoogle, signInWithFacebook, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { resolvedColorScheme } = useColorScheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  useEffect(() => {
    if (user) {
      navigate(redirectUrl);
    }
  }, [user, navigate, redirectUrl]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
    } catch (error) {
      console.error("Facebook login error:", error);
    }
  };

  const logoSrc =
    resolvedColorScheme === "dark" ? "/logo_white.svg" : "/logo.svg";
  return (
    <div className="min-h-screen flex flex-col px-4 py-6 md:px-8 md:py-10">
      <div className="flex justify-end">
        <ThemeToggle variant="menu" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Container size="lg" className="w-full">
          <Card
            shadow="xl"
            radius={32}
            p={0}
            className="overflow-hidden border border-white/70 bg-white/88 dark:bg-slate-900/86 backdrop-blur-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr]">
              <div className="px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
                <Image src={logoSrc} alt="Tripsy Logo" w={300} mb="lg" />

                <form
                  className="mt-8 space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                  }}
                >
                  <TextInput
                    label="ĐỊA CHỈ EMAIL"
                    placeholder="hello@tforart.vn"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    radius={0}
                    variant="unstyled"
                    rightSection={<FieldCheck />}
                    classNames={{
                      label:
                        "!text-[13px] !font-semibold !tracking-[0.02em] !text-slate-800 dark:!text-slate-200",
                      input:
                        "!border-0 !border-b !border-slate-400 dark:!border-slate-500 !rounded-none !px-0 !pb-2 !pt-1 !text-[15px] !text-slate-800 dark:!text-slate-100 placeholder:!text-slate-400",
                    }}
                  />

                  <PasswordInput
                    label="MẬT KHẨU"
                    placeholder="********"
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    radius={0}
                    variant="unstyled"
                    classNames={{
                      label:
                        "!text-[13px] !font-semibold !tracking-[0.02em] !text-slate-800 dark:!text-slate-200",
                      input:
                        "!border-0 !border-b !border-slate-400 dark:!border-slate-500 !rounded-none !px-0 !pb-2 !pt-1 !text-[15px] !text-slate-800 dark:!text-slate-100 placeholder:!text-slate-400",
                      section: "!text-slate-500 dark:!text-slate-400",
                    }}
                  />

                  <Checkbox
                    checked={acceptedTerms}
                    onChange={(event) =>
                      setAcceptedTerms(event.currentTarget.checked)
                    }
                    size="xs"
                    label={
                      <Text
                        size="xs"
                        className="text-slate-700 dark:text-slate-200"
                      >
                        Tôi đồng ý với Điều khoản & Điều kiện
                      </Text>
                    }
                    color="cyan"
                  />

                  <div className="flex flex-wrap gap-3 pt-1">
                    <Button
                      type="button"
                      size="md"
                      radius="xl"
                      disabled={!acceptedTerms}
                      className="min-w-28 bg-cyan-500 hover:bg-cyan-600"
                    >
                      Đăng nhập
                    </Button>

                    <Button
                      type="button"
                      size="md"
                      radius="xl"
                      variant="outline"
                      className="min-w-28 border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/30"
                    >
                      Đăng ký
                    </Button>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Text
                      size="xs"
                      fw={600}
                      className="uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300"
                    >
                      Hoặc tiếp tục với
                    </Text>

                    <div className="flex flex-col gap-3 mt-4">
                      <Button
                        type="button"
                        variant="default"
                        size="lg"
                        radius="xl"
                        fullWidth
                        loading={loading}
                        onClick={() => void handleGoogleLogin()}
                        leftSection={
                          <i className="fa-brands fa-google text-lg text-red-500" />
                        }
                        className="border-slate-300! dark:border-slate-600! text-slate-700! dark:text-slate-100! bg-white! dark:bg-slate-800! hover:bg-slate-50! dark:hover:bg-slate-700! h-12 text-[15px]! font-medium!"
                      >
                        Tiếp tục với Google
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        size="lg"
                        radius="xl"
                        fullWidth
                        loading={loading}
                        onClick={() => void handleFacebookLogin()}
                        leftSection={
                          <i className="fa-brands fa-facebook text-xl text-[#1877F2]" />
                        }
                        className="border-slate-300! dark:border-slate-600! text-slate-700! dark:text-slate-100! bg-white! dark:bg-slate-800! hover:bg-slate-50! dark:hover:bg-slate-700! h-12 text-[15px]! font-medium!"
                      >
                        Tiếp tục với Facebook
                      </Button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="hidden md:block p-5 lg:p-6">
                <div
                  className={`${styles.loginPreviewImage} relative h-full min-h-[420px] w-full rounded-3xl bg-cover bg-center overflow-hidden`}
                >
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-transparent via-transparent to-black/50" />
                  <PhotoCredit
                    label={
                      <p>
                        Bức ảnh được chụp tại Mèo Vạc, Hà Giang (nay thuộc tỉnh
                        Tuyên Quang), Việt Nam
                        <br />
                        Photographer: Nguyễn Sơn Tùng
                      </p>
                    }
                  />
                  <div className="relative z-10 flex h-full items-end p-8 lg:p-10">
                    <motion.div
                      className=""
                      {...createSmoothTextContainerMotionProps()}
                    >
                      <motion.p
                        className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70 mb-3"
                        {...createSmoothTextItemMotionProps(0.1)}
                      >
                        Tforart Tripsy
                      </motion.p>
                      <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-white drop-shadow-lg">
                        <motion.span
                          className="inline-block"
                          {...createSmoothTextItemMotionProps(0.3)}
                        >
                          NỀN TẢNG
                        </motion.span>
                        <br />
                        <motion.span
                          className="inline-block text-cyan-300"
                          {...createSmoothTextItemMotionProps(0.5)}
                        >
                          QUẢN LÝ CHI TIÊU
                        </motion.span>
                        <br />
                        <motion.span
                          className="inline-block font-thin text-3xl"
                          {...createSmoothTextItemMotionProps(0.7)}
                        >
                          CHO HOẠT ĐỘNG CỦA BẠN
                        </motion.span>
                      </h2>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </div>

      <Container size="lg" className="w-full mt-6">
        <SimpleFooter />
      </Container>
    </div>
  );
};

const FieldCheck = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M16.5 5.5L8.2 13.8L4 9.6"
      stroke="#06b6d4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
