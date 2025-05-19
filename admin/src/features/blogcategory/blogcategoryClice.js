import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import blogCategoryService from "./blogcategoryService";

export const getBlogCategorys = createAsyncThunk(
  "blogCategory/get-blogcategories",
  async (thunkAPI) => {
    try {
      return await blogCategoryService.getBlogCategory();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createBlogCategory = createAsyncThunk(
  "blog-category/create-blog-category",
  async (catblogData, thunkAPI) => {
    try {
      return await blogCategoryService.createBlogCategory(catblogData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);
export const deleteBlogCategory = createAsyncThunk(
  "blog-category/delete-blog-category",
  async (id, thunkAPI) => {
    try {
      return await blogCategoryService.deleteBlogCategory(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);
export const getaBlogCategory = createAsyncThunk(
  "blog-category/get-a-blog-category",
  async (id, thunkAPI) => {
    try {
      return await blogCategoryService.getaBlogCategory(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);
export const updateBlogCategory = createAsyncThunk(
  "blog-category/update-blog-category",
  async ({ id, catData }, thunkAPI) => {
    try {
      return await blogCategoryService.updateBlogCategory(id, catData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);

export const resetState = createAction("Reset_all");

const initialState = {
  blogcategories: [],
  newBlogCat: null,
  updatedBlogCategory: null,
  singleBlogCategory: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const blogCategorySlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBlogCategorys.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlogCategorys.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.blogcategories = action.payload;
      })
      .addCase(getBlogCategorys.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(createBlogCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBlogCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.newBlogCat = action.payload;
      })
      .addCase(createBlogCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(deleteBlogCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBlogCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.blogcategories = state.blogcategories.filter(
          (category) => category.id !== action.payload.id
        );
      })
      .addCase(deleteBlogCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(getaBlogCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getaBlogCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.singleBlogCategory = action.payload;
      })
      .addCase(getaBlogCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(updateBlogCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBlogCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updatedBlogCategory = action.payload;
      })
      .addCase(updateBlogCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(resetState, () => initialState);
  },
});
export default blogCategorySlice.reducer;
