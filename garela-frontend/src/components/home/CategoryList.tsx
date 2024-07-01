import { useRecoilState } from "recoil";
import styled from "styled-components";
import { selectedCategoryState } from "../../atom";
import { useNavigate } from "react-router-dom";

const CategoryContainer = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 30px;
  max-height: 500px;
`;

const CategoryTitle = styled.p`
  padding-left: 10px;
  font-weight: bold;
  font-size: 20px;
`

interface CategoryItemProps {
  selected: boolean;
};

const CategoryItem = styled.div<CategoryItemProps>`
  padding: 10px 0;
  padding-left: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#f0f0f0" : "transparent")};
  border-radius: 10px;
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const CategoryList:React.FC = () => {
  const navigate = useNavigate();
  const categories = ["All", "Study", "Cooking"];
  const [selectedCategory, setSelectedCategory] = useRecoilState(selectedCategoryState);
  
  return (
    <CategoryContainer>
      <CategoryTitle>Category</CategoryTitle>
      {categories.map((category) => (
        <CategoryItem
          key={category}
          selected={selectedCategory === category}
          onClick={() => {setSelectedCategory(category); navigate("/home/board")}}
        >
          {category === "All" && "📚 "}
          {category === "Study" && "📖 "}
          {category === "Cooking" && "🍳 "}
          {category}
        </CategoryItem>
      ))}
    </CategoryContainer>
  )
};

export default CategoryList;