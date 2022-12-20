import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      // Se crea un hook automaticamente
      query: () => "/users", // Especificamos el endpoint
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      }, // Validamos que no existan errores al llamar a la API
      transformResponse: (responseData) => {
        // Obtenemos la respuesta de la query
        const loadedUsers = responseData.map((user) => {
          // Recorremos la información traida del backend y setemos el id del usuario sin el (_) "NORMALIZADOS"
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers); // Seteamos a todos los usuario para que todos tengan el id sin el (_) "NORMALIZADOS" y los almacenamos en el userAdapter
      },

      providesTags: (result, error, arg) => {
        // Provedes the tags that can be invalidated
        if (result?.ids) {
          //Error if a result has not ID
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }]; // Fails Safe
      },
    }),

    addNewUser: builder.mutation({
      query: (initialUserData) => ({ // Le pasamos un valor inicial
        url: "/users",  // A un endpoint
        method: "POST", // Con un metodo POST
        body: {
          ...initialUserData, // Por ultimo pasamos el valor inicial definido anteriormente, en el body de la llamada.
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

export const { useGetUsersQuery, useAddNewUserMutation, useUpdateUserMutation, useDeleteUserMutation } = usersApiSlice; // useGetUserQuery HOOK

// Retorna el objeto resultante de la query
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select(); // Llama a getUsers definido anteriormente

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data //Normaliza el objeto con id y entidades
);

// Destructuring del selectUserData selector
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
