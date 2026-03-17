import {
  Anchor,
  Button,
  Card,
  Container,
  List,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const DataDeletion = () => {
  return (
    <div className="min-h-screen py-10 px-4 md:px-8">
      <Container size="md">
        <Card
          shadow="xl"
          radius={24}
          p="xl"
          className="border border-white/70 bg-white/90 dark:bg-slate-900/88 backdrop-blur-md"
        >
          <Stack gap="md">
            <Title order={2}>Data Deletion Instructions</Title>
            <Text>
              Nếu bạn đăng nhập Tripsy bằng Facebook, bạn có thể yêu cầu xóa dữ
              liệu tài khoản Tripsy theo hướng dẫn bên dưới.
            </Text>
            <Text>
              If you signed in to Tripsy with Facebook, you can request deletion
              of your Tripsy account data by following the steps below.
            </Text>

            <Title order={4}>
              Cách 1 / Option 1: Gửi email yêu cầu / Email Request
            </Title>
            <List spacing="xs">
              <List.Item>
                Gửi email đến{" "}
                <Anchor href="mailto:tung.nguyen@tforart.vn">
                  tung.nguyen@tforart.vn
                </Anchor>
                .
              </List.Item>
              <List.Item>
                Tiêu đề email: <strong>Tripsy Data Deletion Request</strong>.
              </List.Item>
              <List.Item>
                Cung cấp email Facebook liên kết và tên hiển thị bạn đã dùng
                trong Tripsy.
              </List.Item>
              <List.Item>
                Yêu cầu hợp lệ sẽ được xử lý trong vòng 7 ngày làm việc.
              </List.Item>
            </List>

            <List spacing="xs">
              <List.Item>
                Send an email to{" "}
                <Anchor href="mailto:tung.nguyen@tforart.vn">
                  tung.nguyen@tforart.vn
                </Anchor>
                .
              </List.Item>
              <List.Item>
                Use subject: <strong>Tripsy Data Deletion Request</strong>.
              </List.Item>
              <List.Item>
                Include your Facebook-linked email and display name used in
                Tripsy.
              </List.Item>
              <List.Item>
                We process verified requests within 7 business days.
              </List.Item>
            </List>

            <Title order={4}>
              Cách 2 / Option 2: Gỡ quyền ứng dụng Facebook / Remove Facebook
              App Access
            </Title>
            <List spacing="xs">
              <List.Item>
                Vào Facebook Settings → Security and Login → Business
                Integrations.
              </List.Item>
              <List.Item>
                Tìm <strong>Tripsy</strong> và gỡ quyền truy cập.
              </List.Item>
            </List>

            <List spacing="xs">
              <List.Item>
                Go to Facebook Settings → Security and Login → Business
                Integrations.
              </List.Item>
              <List.Item>
                Find <strong>Tripsy</strong> and remove access.
              </List.Item>
            </List>

            <Text>
              Việc gỡ quyền Facebook sẽ chặn đăng nhập Facebook trong tương lai.
              Để xóa dữ liệu Tripsy hiện có trên hệ thống, vui lòng gửi yêu cầu
              qua email ở Cách 1.
            </Text>
            <Text>
              Removing Facebook access stops future login via Facebook. To
              delete existing Tripsy data from our systems, please send the
              email request in Option 1.
            </Text>

            <Text size="sm">
              Chính sách quyền riêng tư / Privacy policy:{" "}
              <Link to="/privacy-policy">/privacy-policy</Link>
            </Text>

            <Button
              component={Link}
              to="/login"
              variant="light"
              radius="md"
              w="fit-content"
              leftSection={<ArrowLeft size={16} />}
            >
              Quay lại trang chủ / Back to Home
            </Button>
          </Stack>
        </Card>
      </Container>
    </div>
  );
};

export default DataDeletion;
