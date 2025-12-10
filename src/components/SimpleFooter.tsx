import { Text } from "@mantine/core";

const SimpleFooter = () => {
  const getYear = () => {
    return new Date().getFullYear();
  };
  return (
    <Text ta="center" size="xs" mt="lg" c="white" className="drop-shadow-2xl">
      © {getYear()} Tripsy
      <br />
      Made by Nguyen Son Tung
    </Text>
  );
};

export default SimpleFooter;
