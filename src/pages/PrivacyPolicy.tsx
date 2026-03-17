import {
  Anchor,
  Button,
  Card,
  Container,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const effectiveDate = "17/03/2026";

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
            <Title order={2}>Tripsy Privacy Policy</Title>
            <Text size="sm" c="dimmed">
              Ngày hiệu lực / Effective date: {effectiveDate}
            </Text>

            <Text>
              Tripsy ("chúng tôi") hỗ trợ người dùng quản lý chi tiêu trong các
              chuyến đi chung. Chính sách này giải thích dữ liệu chúng tôi thu
              thập, cách sử dụng và quyền lựa chọn của bạn.
            </Text>
            <Text>
              Tripsy ("we", "our", "us") helps users manage shared trip
              expenses. This policy explains what data we collect, how we use
              it, and your choices.
            </Text>

            <Title order={4}>
              1. Dữ liệu chúng tôi thu thập / Information We Collect
            </Title>
            <Text>
              Khi bạn đăng nhập bằng Facebook, chúng tôi có thể nhận thông tin
              hồ sơ cơ bản gồm tên, ảnh đại diện và email (nếu bạn cấp quyền).
              Chúng tôi cũng lưu dữ liệu do bạn tạo trong ứng dụng như tên
              chuyến đi, thành viên, ghi chú và chi tiêu.
            </Text>
            <Text>
              When you sign in with Facebook, we may receive your basic profile
              information including name, profile photo, and email (if granted).
              We also store trip data you create, such as trip names,
              participants, notes, and expenses.
            </Text>

            <Title order={4}>
              2. Mục đích sử dụng dữ liệu / How We Use Data
            </Title>
            <Text>
              Chúng tôi dùng dữ liệu để xác thực tài khoản, hiển thị hồ sơ và
              cung cấp các tính năng cốt lõi: tạo chuyến đi, thêm thành viên,
              ghi nhận chi tiêu và tổng hợp thanh toán.
            </Text>
            <Text>
              We use your data to authenticate your account, display your
              profile, and provide core features: creating trips, adding
              participants, recording expenses, and showing settlements.
            </Text>

            <Title order={4}>3. Chia sẻ dữ liệu / Data Sharing</Title>
            <Text>
              Chúng tôi không bán dữ liệu cá nhân. Dữ liệu chỉ được hiển thị cho
              những người cùng tham gia một chuyến đi trong phạm vi trải nghiệm
              ứng dụng.
            </Text>
            <Text>
              We do not sell personal data. Data is only shared with people
              participating in the same trip within the app experience.
            </Text>

            <Title order={4}>4. Thời gian lưu trữ / Data Retention</Title>
            <Text>
              Chúng tôi lưu dữ liệu tài khoản và chuyến đi trong thời gian tài
              khoản còn hoạt động hoặc cho đến khi bạn yêu cầu xóa dữ liệu.
              Hướng dẫn xóa dữ liệu có tại trang Data Deletion.
            </Text>
            <Text>
              We retain account and trip data while your account is active or
              until you request deletion. Deletion instructions are available on
              the Data Deletion page.
            </Text>

            <Title order={4}>5. Quyền của bạn / Your Rights</Title>
            <Text>
              Bạn có thể yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân
              bất cứ lúc nào.
            </Text>
            <Text>
              You can request access, correction, or deletion of your personal
              data at any time.
            </Text>

            <Title order={4}>6. Liên hệ / Contact</Title>
            <Text>
              Với câu hỏi về quyền riêng tư hoặc yêu cầu dữ liệu, vui lòng liên
              hệ{" "}
              <Anchor href="mailto:tung.nguyen@tforart.vn">
                tung.nguyen@tforart.vn
              </Anchor>
              .
            </Text>
            <Text>
              For privacy questions or data requests, contact us at{" "}
              <Anchor href="mailto:tung.nguyen@tforart.vn">
                tung.nguyen@tforart.vn
              </Anchor>
              .
            </Text>

            <Text size="sm">
              Hướng dẫn xóa dữ liệu / Data deletion instructions:{" "}
              <Link to="/data-deletion">/data-deletion</Link>
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

export default PrivacyPolicy;
