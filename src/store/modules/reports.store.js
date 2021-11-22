import Axios from 'axios';
const axios = Axios.create({
    headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': _wpnonce
    }
});

const state = {
    loading_state: "loading",
    error: false,
}

const getters = {
}

const actions = {
    async init({ commit, dispatch, state }) {
        try {
            // const review = (await axios.get(`/wp-json/taxonomyengine/v1/review/${taxonomyengine_post_id}`)).data;
            // if (review.review_end && review.review_end !== "0000-00-00 00:00:00") {
            //     commit("SET_LOADING_STATE", "done");
            //     return;
            // }
            // if (review.passed) {
            //     commit("SET_LOADING_STATE", "passed");
            //     return;
            // }
            // const taxonomies = (await axios.get(`/wp-json/taxonomyengine/v1/taxonomies/${taxonomyengine_post_id}`)).data;
            // const selected_taxonomies = review.terms ? review.terms.map(term => term.term_id) : [];
            // commit("SET_KEYVAL", { key: "selected_taxonomies", value: selected_taxonomies });
            // commit("SET_KEYVAL", { key: "taxonomies", value: taxonomies });
            // commit("SET_KEYVAL", { key: "review", value: review });
            // commit("SET_KEYVAL", { key: "page_count", value: Object.keys(taxonomies).length });
            // dispatch("set_page", 1);
            commit("SET_LOADING_STATE", "loaded")
        } catch (error) {
            console.error("Got an error", error.toString())
            commit("SET_KEYVAL", { key: "error", value: error });
            commit("SET_LOADING_STATE", "error")
        }
    },
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