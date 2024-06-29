const theme = {
  colors: {
    primary: '#5A67D8', // 보라색
    secondary: '#4299E1', // 파란색
    background: '#F7FAFC', // 조금 더 어두운 화이트 톤
    surface: '#FFFFFF', // 화이트 톤 배경색
    text: '#1A202C', // 다크 그레이 텍스트 색상
    mutedText: '#718096', // 라이트 그레이 텍스트 색상
    accent: '#805AD5', // 보라색과 파랑색이 적절히 합쳐진 느낌
    input: '#E2E8F0', // 라이트 그레이 input 배경색
    primaryForeground: '#FFFFFF', // 버튼 텍스트 색상
  },
  spacing: (factor: number) => `${factor * 8}px`,
};

export default theme;
