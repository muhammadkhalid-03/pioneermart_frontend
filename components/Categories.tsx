import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { CategoryType } from '@/types/types';

type CategoriesProps = {
  categories: CategoryType[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
};

const Categories = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoriesProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* "All" category option  because all is currently null so we need to handle it separately*/}
        <TouchableOpacity
          style={[
            styles.categoryItem,
            selectedCategory === null && styles.selectedCategory
          ]}
          onPress={() => onSelectCategory(null)}
        >
          <Text 
            style={[
              styles.categoryText,
              selectedCategory === null && styles.selectedCategoryText
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {/* list of categories */}
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => onSelectCategory(category.id)}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCategory: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: '600',
  },
});