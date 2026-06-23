export function KuraWordmark({ fontSize = 20 }: { fontSize?: number }) {
  return (
    <span
      style={{
        fontSize,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        background: 'linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      Kura
    </span>
  );
}
