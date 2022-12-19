import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({ 
    getUsers: builder.query({  // Se crea un hook automaticamente
      query: () => "/users", // Especificamos el endpoint
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      }, // Validamos que no existan errores al llamar a la API
      keepUnusedDataFor: 5, // Tiempo que se quedara la información en el cache

      transformResponse: (responseData) => {
        // Obtenemos la respuesta de la query
        const loadedUsers = responseData.map((user) => {
          // Recorremos la información traida del backend y setemos el id del usuario sin el (_) "NORMALIZADOS"
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers); // Seteamos a todos los usuario para que todos tengan el id sin el (_) "NORMALIZADOS" y los almacenamos en el userAdapter
      },

      providesTags: (result, error, arg) => { // Provedes the tags that can be invalidated
        if (result?.ids) { //Error if a result has not ID
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }]; // Fails Safe
      },
    }),
  }),
});

export const { useGetUsersQuery } = usersApiSlice; // useGetUserQuery HOOK

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
