import styled from "styled-components";
import CategoryList from "./CategoryList";
import PostList from "./PostList";
import AdBanner from "./AdBanner";
import TrendingPostList from "./TrendingPostList";
import { useState } from "react";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 2.5fr 1.2fr;
  gap: 40px;
  padding: 20px;
  padding-left: 80px;
  padding-right: 80px;
  width: 100%;
  margin-top: 80px; /* 네비게이션 바의 높이를 고려한 마진 */
`;

const FixedCategoryList = styled.div`
  position: fixed;
  top: 100px; /* Adjust this value based on the height of the Navbar */
  left: 80px; /* padding-left 값과 동일하게 맞춤 */
  width: 20%;
`;

const FixedTrendingPostList = styled.div`
  position: fixed;
  top: 100px; /* Adjust this value based on the height of the Navbar */
  right: 80px; /* padding-right 값과 동일하게 맞춤 */
  width: 20%;
`;

const Board:React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <Container>
      <FixedCategoryList>
        <CategoryList
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </FixedCategoryList>
      <div></div> {/* 카테고리 리스트의 공간을 차지 */}
      <PostList
        selectedCategory={selectedCategory}
        filter={filter}
        setFilter={setFilter}
      />
      <FixedTrendingPostList>
        <AdBanner />
        <TrendingPostList />
      </FixedTrendingPostList>
    </Container>
  )
}

export default Board;