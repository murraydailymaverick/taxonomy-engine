import Axios from 'axios';
const axios = Axios.create({
    headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': _wpnonce
    }
});

const state = {
    loading_state: "loading",
    page_count: 0,
    current_page: 1,
    taxonomies: {},
    current_taxonomy: {},
    review: {},
    error: false,
}

const getters = {
}

const actions = {
    async init({ commit, dispatch, state }) {
        try {
            const review = (await axios.get(`/wp-json/taxonomyengine/v1/review/${taxonomyengine_post_id}`)).data;
            if (review.review_end) {
                commit("SET_LOADING_STATE", "done");
                return;
            }
            const taxonomies = (await axios.get(`/wp-json/taxonomyengine/v1/taxonomies/${taxonomyengine_post_id}`)).data;
            commit("SET_KEYVAL", { key: "taxonomies", value: taxonomies });
            commit("SET_KEYVAL", { key: "review", value: review });
            commit("SET_KEYVAL", { key: "page_count", value: Object.keys(taxonomies).length });
            dispatch("set_page", 1);
            commit("SET_LOADING_STATE", "loaded")
        } catch (error) {
            console.error("Got an error", error.toString())
            commit("SET_KEYVAL", { key: "error", value: error });
            commit("SET_LOADING_STATE", "error")
        }
        
    },

    set_page({ commit, state }, page) {
        commit("SET_KEYVAL", { key: "current_page", value: page });
        commit("SET_KEYVAL", { key: "current_taxonomy", value: state.taxonomies[Object.keys(state.taxonomies)[page - 1]] });
    },

    next_page({ dispatch, state }) {
        if (state.current_page < state.page_count) {
            dispatch("set_page", state.current_page + 1);
        }
    },

    prev_page({ dispatch, state }) {
        if (state.current_page > 1) {
            dispatch("set_page", state.current_page - 1);
        }
    },
    
    async done({ commit, state }) {
        await axios.post(`/wp-json/taxonomyengine/v1/taxonomies/${taxonomyengine_post_id}/done`);
        commit("SET_LOADING_STATE", "done");
    },

    async save_taxonomy({ commit, state }, taxonomy) {
        try {
            await axios.post(`/wp-json/taxonomyengine/v1/taxonomies/${taxonomyengine_post_id}`, {taxonomy});
        } catch (error) {
            console.error(error)
            commit("SET_KEYVAL", { key: "error", value: error });
        }
    }
}

const mutations = {
    SET_KEYVAL (state, keyval) {
        state[keyval.key] = keyval.value
    },
    SET_LOADING_STATE(state, loading_state) {
        state.loading_state = loading_state;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}