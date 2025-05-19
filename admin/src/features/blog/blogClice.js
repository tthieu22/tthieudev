import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import blogService from "./blogService";

export const getBlogs = createAsyncThunk("blog/get-blogs", async (thunkAPI) => {
  try {
    return await blogService.getBlog();
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const createBlog = createAsyncThunk(
  "product/create-product",
  async (blogData, thunkAPI) => {
    try {
      return await blogService.createBlog(blogData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);
export const deleteaBlog = createAsyncThunk(
  "product/delete-product",
  async (id, thunkAPI) => {
    try {
      return await blogService.deleteBlog(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);
export const getaBlog = createAsyncThunk(
  "product/get-a-product",
  async (id, thunkAPI) => {
    try {
      return await blogService.getaBlog(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);
export const uploadBlogImages = createAsyncThunk(
  "blog/upload-blog-images",
  async ({ id, data }, thunkAPI) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < data.length; i++) {
        formData.append("images", data[i]);
      }
      return await blogService.uploadImagesBlog(id, formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);

export const deleteBlogImages = createAsyncThunk(
  "blog/delete-blog-image",
  async (public_id, thunkAPI) => {
    try {
      return await blogService.deleteImageBlog(public_id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || error);
    }
  }
);

// Update product
export const updateaBlog = createAsyncThunk(  
  "product/update-product",
  async ({ id, product }, thunkAPI) => {
    try {
      return await blogService.updateaBlog(id, product);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Function to reset the state
export const resetState = createAction("Reset_all");

const initialState = {
  blogs: [],
  createblog: null,
  deleteBlog: null,
  singleBlog: null,
  updateImage: null,
  deleteImage: null,
  updateBlog: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};
export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.blogs = action.payload;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createblog = action.payload;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch users";
      })
      .addCase(deleteaBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteaBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const id = action.meta.arg;
        state.blogs = state.blogs.filter((item) => item._id !== id);
        state.deleteBlog = action.payload;
      })
      .addCase(deleteaBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch blogs";
      })
      .addCase(getaBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getaBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.singleBlog = action.payload;
      })
      .addCase(getaBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch blogs";
      })
      .addCase(uploadBlogImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadBlogImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updateBlogImage = action.payload;
      })
      .addCase(uploadBlogImages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch blogs";
      })
      .addCase(deleteBlogImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBlogImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deleteaBlogImage = action.payload;
      })
      .addCase(deleteBlogImages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch blogs";
      })
      .addCase(updateaBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateaBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updateaBlog = action.payload;
      })
      .addCase(updateaBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Failed to fetch blogs";
      })
      .addCase(resetState, () => initialState);
  },
});
export default blogSlice.reducer;
