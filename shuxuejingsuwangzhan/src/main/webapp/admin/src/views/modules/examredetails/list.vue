<template>
    <div class="main-content">
        <!-- 条件查询 -->
        <div v-if="showFlag">
            <el-form :inline="true" :model="searchForm" class="form-content">
                <el-row :gutter="20" class="slt" :style="{justifyContent:contents.searchBoxPosition=='1'?'flex-start':contents.searchBoxPosition=='2'?'center':'flex-end'}">



                    <el-form-item :label="contents.inputTitle == 1 ? '试题名称' : ''">
                        <el-input prefix-icon="el-icon-search" v-model="searchForm.examquestionName" placeholder="试题名称" clearable></el-input>
                    </el-form-item>



                    <el-form-item :label="contents.inputTitle == 1 ? '用户姓名' : ''">
                        <el-input prefix-icon="el-icon-search" v-model="searchForm.yonghuName" placeholder="用户姓名" clearable></el-input>
                    </el-form-item>



                    <el-form-item>
                        <el-button type="success" @click="search()">{{ contents.searchBtnFont == 1?'查询':'' }}<i class="el-icon-search el-icon--right"/></el-button>
                    </el-form-item>
                </el-row>
                <el-row class="ad" :style="{justifyContent:contents.btnAdAllBoxPosition=='1'?'flex-start':contents.btnAdAllBoxPosition=='2'?'center':'flex-end'}">
                    <el-form-item>
                        <el-button
                                v-if="isAuth('examrecord','新增')"
                                type="success"
                                icon="el-icon-plus"
                                @click="addOrUpdateHandler()"
                        >{{ contents.btnAdAllFont == 1?'新增':'' }}</el-button>
                        <el-button
                                v-if="isAuth('examrecord','删除')"
                                :disabled="dataListSelections.length <= 0"
                                type="danger"
                                icon="el-icon-delete"
                                @click="deleteHandler()"
                        >{{ contents.btnAdAllFont == 1?'删除':'' }}</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
            <div class="table-content">
                <el-table class="tables" :size="contents.tableSize" :show-header="contents.tableShowHeader"
                          :header-row-style="headerRowStyle" :header-cell-style="headerCellStyle"
                          :border="contents.tableBorder"
                          :fit="contents.tableFit"
                          :stripe="contents.tableStripe"
                          :row-style="rowStyle"
                          :cell-style="cellStyle"
                          :style="{width: '100%',fontSize:contents.tableContentFontSize,color:contents.tableContentFontColor}"
                          v-if="isAuth('examrecord','查看')"
                          :data="dataList"
                          v-loading="dataListLoading"
                          @selection-change="selectionChangeHandler">
                    <el-table-column  v-if="contents.tableSelection"
                                      type="selection"
                                      header-align="center"
                                      align="center"
                                      width="50">
                    </el-table-column>
                    <el-table-column label="索引" v-if="contents.tableIndex" type="index" width="50" />

                    <el-table-column  :sortable="contents.tableSortable" :align="contents.tableAlign"
                                      prop="examredetailsUuidNumber"
                                      header-align="center"
                                      label="试卷编号">
                        <template slot-scope="scope">
                            {{scope.row.examredetailsUuidNumber}}
                        </template>
                    </el-table-column>


                    <el-table-column  :sortable="contents.tableSortable" :align="contents.tableAlign"
                                      prop="examquestionName"
                                      header-align="center"
                                      label="试题名称">
                        <template slot-scope="scope">
                            <div v-if="scope.row.examquestionName.length>10">
                                {{scope.row.examquestionName.substring(0,10)}}...
                            </div>
                            <div v-else>
                                {{scope.row.examquestionName}}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column  :sortable="contents.tableSortable" :align="contents.tableAlign"
                                      prop="examquestionScore"
                                      header-align="center"
                                      label="分值">
                        <template slot-scope="scope">
                            {{scope.row.examquestionScore}}
                        </template>
                    </el-table-column>


                    <el-table-column  :sortable="contents.tableSortable" :align="contents.tableAlign"
                                      prop="examquestionTypes"
                                      header-align="center"
                                      label="试题类型">
                        <template slot-scope="scope">
                            {{scope.row.examquestionValue}}
                        </template>
                    </el-table-column>


                    <el-table-column  :sortable="contents.tableSortable" :align="contents.tableAlign"
                                      prop="yonghuName"
                                      header-align="center"
                                      label="用户姓名">
                        <template slot-scope="scope">
                            {{scope.row.yonghuName}}
                        </template>
                    </el-table-column>

                    <el-table-column  :sortable="contents.tableSortable" :align="contents.tableAlign"
                                      prop="examredetailsMyanswer"
                                      header-align="center"
                                      label="考生答案">
                        <template slot-scope="scope">
                            {{scope.row.examredetailsMyanswer}}
                        </template>
                    </el-table-column>
                    <el-table-column  :sortable="contents.tableSortable" :align="contents.tableAlign"
                                      prop="examredetailsMyscore"
                                      header-align="center"
                                      label="试题得分">
                        <template slot-scope="scope">
                            {{scope.row.examredetailsValue!=""?scope.row.examredetailsMyscore:'未批改'}}
                        </template>
                    </el-table-column>

                    <el-table-column  :sortable="contents.tableSortable" :align="contents.tableAlign"
                                      prop="examinationName"
                                      header-align="center"
                                      label="审核教师">
                        <template slot-scope="scope">
                            {{scope.row.examredetailsValue!=""?scope.row.examinationName:'未批改'}}
                        </template>
                    </el-table-column>

                    <el-table-column  :sortable="contents.tableSortable" :align="contents.tableAlign"
                                      prop="examredetailsTypes"
                                      header-align="center"
                                      label="审核结果">
                        <template slot-scope="scope">
                            {{scope.row.examredetailsValue!=""?scope.row.examredetailsValue:'未批改'}}
                        </template>
                    </el-table-column>

                    <el-table-column width="300" :align="contents.tableAlign"
                                     header-align="center"
                                     label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="isAuth('examrecord','查看')" type="success" icon="el-icon-tickets" size="mini" @click="addOrUpdateHandler(scope.row.id,'info')">{{ contents.tableBtnFont == 1?'详情':'' }}</el-button>

                            <el-button v-if="isAuth('examrecord','批改')&&scope.row.examredetailsValue==''" type="primary" icon="el-icon-edit" size="mini" @click="correct(scope.row.id)">{{ contents.tableBtnFont == 1?'批改':'' }}</el-button>

                            <el-button v-if="isAuth('examrecord','删除')" type="danger" icon="el-icon-delete" size="mini" @click="deleteHandler(scope.row.id)">{{ contents.tableBtnFont == 1?'删除':'' }}</el-button>

                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        clsss="pages"
                        :layout="layouts"
                        @size-change="sizeChangeHandle"
                        @current-change="currentChangeHandle"
                        :current-page="pageIndex"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="Number(contents.pageEachNum)"
                        :total="totalPage"
                        :small="contents.pageStyle"
                        class="pagination-content"
                        :background="contents.pageBtnBG"
                        :style="{textAlign:contents.pagePosition==1?'left':contents.pagePosition==2?'center':'right'}"
                ></el-pagination>
            </div>
        </div>
        <!-- 添加/修改页面  将父组件的search方法传递给子组件-->
        <add-or-update v-if="addOrUpdateFlag" :parent="this" ref="addOrUpdate"></add-or-update>


        <el-dialog :title="ruleForm.examquestionName" :visible.sync="dialogFormVisible">
            <el-form :model="ruleForm">
                <el-form-item  v-if="ruleForm.examquestionTypes!=4" label="选项" prop="examquestionOptions">
                    <div style="margin-left: 40px;"  class="options" v-for="(item,index) in options" v-bind:key="index">
                        {{item.code}}. {{item.text}}
                    </div>
                </el-form-item>
                <el-form-item class="input" label="考生作答" prop="examredetailsMyanswer">
                    <el-input style="width: 400px;" v-model="ruleForm.examredetailsMyanswer"
                              placeholder="考生作答" readonly></el-input>
                </el-form-item>
                <el-form-item label="审批结果">
                    <el-select v-model="shenpi" placeholder="请选择活动区域">
                        <el-option label="对" value="1"></el-option>
                        <el-option label="错" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="this.shenpi==2" class="input" label="试题得分">
                    <el-input style="width: 400px;" v-model="fenshu"
                              placeholder="试题得分" type="number"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="shnpikaoti()">确 定</el-button>
            </div>
        </el-dialog>



    </div>
</template>
<script>
    import AddOrUpdate from "./add-or-update";
    import styleJs from "../../../utils/style.js";
    export default {
        data() {
            return {
                searchForm: {
                    key: ""
                },
                shenpi:null,
                fenshu:0,
                ruleForm:{},
                options:[],
                dialogFormVisible:false,
                form:{},
                dataList: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false,
                dataListSelections: [],
                showFlag: true,
                sfshVisiable: false,
                shForm: {},
                chartVisiable: false,
                addOrUpdateFlag:false,
                contents:null,
                layouts: '',


            };
        },
        created() {
            this.contents = styleJs.listStyle();
            this.init();
            this.getDataList();
            this.contentStyleChange()
        },
        mounted() {

        },
        filters: {
            htmlfilter: function (val) {
                return val.replace(/<[^>]*>/g).replace(/undefined/g,'');
            }
        },
        components: {
            AddOrUpdate,
        },
        methods: {
            shnpikaoti(){
                this.dialogFormVisible = false
                if(this.shenpi == 2 &&this.fenshu>this.ruleForm.examquestionScore){
                    this.$message({
                        message: '为错的题目所得分数不能超过 或 相等同于题目本身分数！！！',
                        type: 'warning'
                    });
                    this.shenpi="对"
                    this.fenshu=0
                    return false;
                }else if(this.shenpi == 1){
                    this.fenshu = this.ruleForm.examquestionScore
                }

                this.$http({
                    url: "examredetails/shenpi?id="+this.ruleForm.id+"&fenshu="+this.fenshu+"&jieguo="+this.shenpi,
                    method: "get",
                    params: null
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.search();
                    } else {
                    }
                });
            },
            correct(id){
                this.dialogFormVisible = true
                this.$http({
                    url: "examredetails/info/"+id,
                    method: "get",
                    params: null
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.ruleForm = data.data;
                        if(this.ruleForm.examquestionTypes ==1 || this.ruleForm.examquestionTypes == 2 || this.ruleForm.examquestionTypes == 3){
                            this.options = JSON.parse(this.ruleForm.examquestionOptions)
                        }
                        this.ruleForm.examquestionName = "题目:（"+this.ruleForm.examquestionValue+"，"+this.ruleForm.examquestionScore +"分）"+ this.ruleForm.examquestionName
                        console.log(this.ruleForm.examquestionName)
                    } else {
                        this.ruleForm = {};
                    }
                });
            },
            contentStyleChange() {
                this.contentSearchStyleChange()
                this.contentBtnAdAllStyleChange()
                this.contentSearchBtnStyleChange()
                this.contentTableBtnStyleChange()
                this.contentPageStyleChange()
            },
            contentSearchStyleChange() {
                this.$nextTick(()=>{
                    document.querySelectorAll('.form-content .slt .el-input__inner').forEach(el=>{
                        let textAlign = 'left'
                        if(this.contents.inputFontPosition == 2) textAlign = 'center'
                        if(this.contents.inputFontPosition == 3) textAlign = 'right'
                        el.style.textAlign = textAlign
                        el.style.height = this.contents.inputHeight
                        el.style.lineHeight = this.contents.inputHeight
                        el.style.color = this.contents.inputFontColor
                        el.style.fontSize = this.contents.inputFontSize
                        el.style.borderWidth = this.contents.inputBorderWidth
                        el.style.borderStyle = this.contents.inputBorderStyle
                        el.style.borderColor = this.contents.inputBorderColor
                        el.style.borderRadius = this.contents.inputBorderRadius
                        el.style.backgroundColor = this.contents.inputBgColor
                    })
                    if(this.contents.inputTitle) {
                        document.querySelectorAll('.form-content .slt .el-form-item__label').forEach(el=>{
                            el.style.color = this.contents.inputTitleColor
                            el.style.fontSize = this.contents.inputTitleSize
                            el.style.lineHeight = this.contents.inputHeight
                        })
                    }
                    setTimeout(()=>{
                        document.querySelectorAll('.form-content .slt .el-input__prefix').forEach(el=>{
                            el.style.color = this.contents.inputIconColor
                            el.style.lineHeight = this.contents.inputHeight
                        })
                        document.querySelectorAll('.form-content .slt .el-input__suffix').forEach(el=>{
                            el.style.color = this.contents.inputIconColor
                            el.style.lineHeight = this.contents.inputHeight
                        })
                        document.querySelectorAll('.form-content .slt .el-input__icon').forEach(el=>{
                            el.style.lineHeight = this.contents.inputHeight
                        })
                    },10)

                })
            },
            // 搜索按钮
            contentSearchBtnStyleChange() {
                this.$nextTick(()=>{
                    document.querySelectorAll('.form-content .slt .el-button--success').forEach(el=>{
                        el.style.height = this.contents.searchBtnHeight
                        el.style.color = this.contents.searchBtnFontColor
                        el.style.fontSize = this.contents.searchBtnFontSize
                        el.style.borderWidth = this.contents.searchBtnBorderWidth
                        el.style.borderStyle = this.contents.searchBtnBorderStyle
                        el.style.borderColor = this.contents.searchBtnBorderColor
                        el.style.borderRadius = this.contents.searchBtnBorderRadius
                        el.style.backgroundColor = this.contents.searchBtnBgColor
                    })
                })
            },
            // 新增、批量删除
            contentBtnAdAllStyleChange() {
                this.$nextTick(()=>{
                    document.querySelectorAll('.form-content .ad .el-button--success').forEach(el=>{
                        el.style.height = this.contents.btnAdAllHeight
                        el.style.color = this.contents.btnAdAllAddFontColor
                        el.style.fontSize = this.contents.btnAdAllFontSize
                        el.style.borderWidth = this.contents.btnAdAllBorderWidth
                        el.style.borderStyle = this.contents.btnAdAllBorderStyle
                        el.style.borderColor = this.contents.btnAdAllBorderColor
                        el.style.borderRadius = this.contents.btnAdAllBorderRadius
                        el.style.backgroundColor = this.contents.btnAdAllAddBgColor
                    })
                    document.querySelectorAll('.form-content .ad .el-button--danger').forEach(el=>{
                        el.style.height = this.contents.btnAdAllHeight
                        el.style.color = this.contents.btnAdAllDelFontColor
                        el.style.fontSize = this.contents.btnAdAllFontSize
                        el.style.borderWidth = this.contents.btnAdAllBorderWidth
                        el.style.borderStyle = this.contents.btnAdAllBorderStyle
                        el.style.borderColor = this.contents.btnAdAllBorderColor
                        el.style.borderRadius = this.contents.btnAdAllBorderRadius
                        el.style.backgroundColor = this.contents.btnAdAllDelBgColor
                    })
                    document.querySelectorAll('.form-content .ad .el-button--warning').forEach(el=>{
                        el.style.height = this.contents.btnAdAllHeight
                        el.style.color = this.contents.btnAdAllWarnFontColor
                        el.style.fontSize = this.contents.btnAdAllFontSize
                        el.style.borderWidth = this.contents.btnAdAllBorderWidth
                        el.style.borderStyle = this.contents.btnAdAllBorderStyle
                        el.style.borderColor = this.contents.btnAdAllBorderColor
                        el.style.borderRadius = this.contents.btnAdAllBorderRadius
                        el.style.backgroundColor = this.contents.btnAdAllWarnBgColor
                    })
                })
            },
            // 表格
            rowStyle({ row, rowIndex}) {
                if (rowIndex % 2 == 1) {
                    if(this.contents.tableStripe) {
                        return {color:this.contents.tableStripeFontColor}
                    }
                } else {
                    return ''
                }
            },
            cellStyle({ row, rowIndex}){
                if (rowIndex % 2 == 1) {
                    if(this.contents.tableStripe) {
                        return {backgroundColor:this.contents.tableStripeBgColor}
                    }
                } else {
                    return ''
                }
            },
            headerRowStyle({ row, rowIndex}){
                return {color: this.contents.tableHeaderFontColor}
            },
            headerCellStyle({ row, rowIndex}){
                return {backgroundColor: this.contents.tableHeaderBgColor}
            },
            // 表格按钮
            contentTableBtnStyleChange(){
                // this.$nextTick(()=>{
                //   setTimeout(()=>{
                //     document.querySelectorAll('.table-content .tables .el-table__body .el-button--success').forEach(el=>{
                //       el.style.height = this.contents.tableBtnHeight
                //       el.style.color = this.contents.tableBtnDetailFontColor
                //       el.style.fontSize = this.contents.tableBtnFontSize
                //       el.style.borderWidth = this.contents.tableBtnBorderWidth
                //       el.style.borderStyle = this.contents.tableBtnBorderStyle
                //       el.style.borderColor = this.contents.tableBtnBorderColor
                //       el.style.borderRadius = this.contents.tableBtnBorderRadius
                //       el.style.backgroundColor = this.contents.tableBtnDetailBgColor
                //     })
                //     document.querySelectorAll('.table-content .tables .el-table__body .el-button--primary').forEach(el=>{
                //       el.style.height = this.contents.tableBtnHeight
                //       el.style.color = this.contents.tableBtnEditFontColor
                //       el.style.fontSize = this.contents.tableBtnFontSize
                //       el.style.borderWidth = this.contents.tableBtnBorderWidth
                //       el.style.borderStyle = this.contents.tableBtnBorderStyle
                //       el.style.borderColor = this.contents.tableBtnBorderColor
                //       el.style.borderRadius = this.contents.tableBtnBorderRadius
                //       el.style.backgroundColor = this.contents.tableBtnEditBgColor
                //     })
                //     document.querySelectorAll('.table-content .tables .el-table__body .el-button--danger').forEach(el=>{
                //       el.style.height = this.contents.tableBtnHeight
                //       el.style.color = this.contents.tableBtnDelFontColor
                //       el.style.fontSize = this.contents.tableBtnFontSize
                //       el.style.borderWidth = this.contents.tableBtnBorderWidth
                //       el.style.borderStyle = this.contents.tableBtnBorderStyle
                //       el.style.borderColor = this.contents.tableBtnBorderColor
                //       el.style.borderRadius = this.contents.tableBtnBorderRadius
                //       el.style.backgroundColor = this.contents.tableBtnDelBgColor
                //     })

                //   }, 50)
                // })
            },
            // 分页
            contentPageStyleChange(){
                let arr = []

                if(this.contents.pageTotal) arr.push('total')
                if(this.contents.pageSizes) arr.push('sizes')
                if(this.contents.pagePrevNext){
                    arr.push('prev')
                    if(this.contents.pagePager) arr.push('pager')
                    arr.push('next')
                }
                if(this.contents.pageJumper) arr.push('jumper')
                this.layouts = arr.join()
                this.contents.pageEachNum = 10
            },

            init () {
            },
            search() {
                this.pageIndex = 1;
                this.getDataList();
            },
            // 获取数据列表
            getDataList() {
                this.dataListLoading = true;
                let params = {
                    page: this.pageIndex,
                    limit: this.pageSize,
                    sort: 'id',
                }
                if(this.$route.query.uuid != null){
                    params['examredetailsUuidNumber'] = this.$route.query.uuid
                }

                if(this.searchForm.examquestionName!='' && this.searchForm.examquestionName!=undefined){
                    params['examquestionName'] = '%' + this.searchForm.examquestionName + '%'
                }

                if(this.searchForm.examquestionScore!='' && this.searchForm.examquestionScore!=undefined){
                    params['examquestionScore'] =  this.searchForm.examquestionScore
                }
                if(this.searchForm.createTimeStartSearch!='' && this.searchForm.createTimeStartSearch!=undefined){
                    params['createTimeStartSearch'] =  this.searchForm.createTimeStartSearch
                }
                if(this.searchForm.createTimeEndSearch!='' && this.searchForm.createTimeEndSearch!=undefined){
                    params['createTimeEndSearch'] =  this.searchForm.createTimeEndSearch
                }

                if(this.searchForm.yonghuName!='' && this.searchForm.yonghuName!=undefined){
                    params['yonghuName'] = '%' + this.searchForm.yonghuName + '%'
                }
                if(this.searchForm.createTimeStartSearch!='' && this.searchForm.createTimeStartSearch!=undefined){
                    params['createTimeStartSearch'] =  this.searchForm.createTimeStartSearch
                }
                if(this.searchForm.createTimeEndSearch!='' && this.searchForm.createTimeEndSearch!=undefined){
                    params['createTimeEndSearch'] =  this.searchForm.createTimeEndSearch
                }



                this.$http({
                    url: "examredetails/page",
                    method: "get",
                    params: params
                }).then(({ data }) => {
                    if (data && data.code === 0) {
                        this.dataList = data.data.list;
                        this.totalPage = data.data.total;
                    } else {
                        this.dataList = [];
                        this.totalPage = 0;
                    }
                    this.dataListLoading = false;
                });

                //查询级联表搜索条件所有列表
                //查询当前表搜索条件所有列表
            },
            //每页数
            sizeChangeHandle(val) {
                this.pageSize = val;
                this.pageIndex = 1;
                this.getDataList();
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val;
                this.getDataList();
            },
            // 多选
            selectionChangeHandler(val) {
                this.dataListSelections = val;
            },
            // 添加/修改
            addOrUpdateHandler(id,type) {
                this.showFlag = false;
                this.addOrUpdateFlag = true;
                this.crossAddOrUpdateFlag = false;
                if(type!='info'){
                    type = 'else';
                }
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.init(id,type);
                });
            },
            // 下载
            download(file){
                window.open(" ${file} ")
            },
            // 删除
            deleteHandler(id) {
                var ids = id
                        ? [Number(id)]
                        : this.dataListSelections.map(item => {
                            return Number(item.id);
                        });

                this.$confirm(`确定进行[${id ? "删除" : "批量删除"}]操作?`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http({
                        url: "examredetails/delete",
                        method: "post",
                        data: ids
                    }).then(({ data }) => {
                        if (data && data.code === 0) {
                            this.$message({
                                message: "操作成功",
                                type: "success",
                                duration: 1500,
                                onClose: () => {
                                    this.search();
                                }
                            });
                        } else {
                            this.$message.error(data.msg);
                        }
                    });
                });
            },
        }

    };
</script><style lang="scss" scoped>
.slt {
    margin: 0 !important;
    display: flex;
  }

  .ad {
    margin: 0 !important;
    display: flex;
  }

  .pages {
    & /deep/ el-pagination__sizes{
      & /deep/ el-input__inner {
        height: 22px;
        line-height: 22px;
      }
    }
  }


  .el-button+.el-button {
    margin:0;
  }

  .tables {
	& /deep/ .el-button--success {
		height: 35px;
		color: rgba(4, 4, 4, 1);
		font-size: 1px;
		border-width: 0px;
		border-style: solid;
		border-color: rgba(1, 1, 1, 1);
		border-radius: 4px;
		background-color: rgba(253, 228, 79, 1);
	}

	& /deep/ .el-button--primary {
		height: 35px;
		color: rgba(8, 8, 8, 1);
		font-size: 1px;
		border-width: 0px;
		border-style: solid;
		border-color: rgba(1, 1, 1, 1);
		border-radius: 4px;
		background-color: rgba(240, 125, 48, 1);
	}

	& /deep/ .el-button--danger {
		height: 35px;
		color: rgba(8, 8, 8, 1);
		font-size: 1px;
		border-width: 0px;
		border-style: solid;
		border-color: rgba(1, 1, 1, 1);
		border-radius: 4px;
		background-color: rgba(233, 95, 64, 1);
	}

    & /deep/ .el-button {
      margin: 4px;
    }
  }</style>


