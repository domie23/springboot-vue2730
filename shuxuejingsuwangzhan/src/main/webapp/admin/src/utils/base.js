const base = {
    get() {
        return {
            url : "http://localhost:8080/shuxuejingsuwangzhan/",
            name: "shuxuejingsuwangzhan",
            // 退出到首页链接
            indexUrl: 'http://localhost:8080/shuxuejingsuwangzhan/front/index.html'
        };
    },
    getProjectName(){
        return {
            projectName: "数学竞赛网站"
        } 
    }
}
export default base
