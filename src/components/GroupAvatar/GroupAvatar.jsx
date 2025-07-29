import PropTypes from "prop-types";

export default function GroupAvatar({
  avatars = [],
  size = 50,
  className,
  style,
}) {
  // Lấy tối đa 3 avatar
  const displayAvatars = avatars.slice(0, 3);

  // Kích thước container hình tròn
  const containerSize = size;
  // Kích thước mỗi avatar nhỏ hơn để vừa trong hình tròn
  const avatarSize = size * 0.65;

  // Tính toán vị trí tam giác đều, căn giữa hình tròn
  const center = containerSize / 2;
  const radius = (containerSize - avatarSize) / 2;
  const angleStep = (2 * Math.PI) / 3; // 120 độ

  const positions = displayAvatars.map((_, idx) => {
    const angle = -Math.PI / 2 + idx * angleStep; // Bắt đầu từ trên đỉnh
    return {
      left: center + radius * Math.cos(angle) - avatarSize / 2,
      top: center + radius * Math.sin(angle) - avatarSize / 2,
    };
  });

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: containerSize,
        height: containerSize,
        borderRadius: "50%",
        overflow: "hidden",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {displayAvatars.map((src, idx) => {
        const { left, top } = positions[idx];
        return (
          <img
            key={idx}
            src={src}
            alt=""
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: "50%",
              objectFit: "cover",
              position: "absolute",
              left,
              top,
              background: "#eee",
              boxSizing: "border-box",
            }}
          />
        );
      })}
    </div>
  );
}

GroupAvatar.propTypes = {
  avatars: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};
