export const saveLastVisitedPage = () => {
    const currentPage = window.location.pathname;
    const lastPage = sessionStorage.getItem("lastVisitedPage");

    if (!lastPage || lastPage === "/login-prompt") {
        console.log("✅ Saving previous page:", currentPage);
        sessionStorage.setItem("lastVisitedPage", currentPage);
    } else {
        console.log("✅ Previous page already saved:", lastPage);
    }
};
