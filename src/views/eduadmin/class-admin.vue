<template>
  <div class="app-container">

    <el-tabs type="card" v-model="tabActiveName"  @tab-click="handleClick" >
        <el-tab-pane  v-for="item in gradeDataList" :key="item.classId" :label="item.gradeName"  :name="item.gradeName"></el-tab-pane>
    </el-tabs>

    <el-form label-position="left" inline class="grade-summary">
          <el-form-item label="班级数">
              <el-tag type="warning">{{ selectedGrade.classCount }}</el-tag>
          </el-form-item>
          <el-form-item label="总人数">
               <el-tag type="danger">{{ selectedGrade.total }}</el-tag>
          </el-form-item>
    </el-form>

    <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd" style="margin-bottom:20px; float:right ">新增</el-button>

    <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="specifyClassList"
            border
            fit
            highlight-current-row
          >
            <el-table-column label="班级" min-width="150px" align="center">
              <template slot-scope="{row}">
                <span class="link-type">{{row.classGrade +'年'+row.classCode+'班' }}</span>
              </template>
            </el-table-column>

            <el-table-column label="人数" width="110px" align="center">
              <template slot-scope="{row}">
                <el-tag>{{ row.num }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="班主任" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              align="center"
              width="250"
              class-name="small-padding fixed-width"
              type="index"
            >
              <template slot-scope="{row,$index}">
                <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
                <el-button size="mini" type="success" @click="handleDetail(row)">详情</el-button>
                <el-button
                  v-if="row.status!='deleted'"
                  size="mini"
                  type="danger"
                  @click="onDeleteBtnClick(row,$index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>


    <el-dialog title="新增" :visible.sync="dialogFormVisible">

         <div>
            <el-radio v-model="createGradeCode" label="1" border>一年级</el-radio>
            <el-radio v-model="createGradeCode" label="2" border>二年级</el-radio>
            <el-radio v-model="createGradeCode" label="3" border>三年级</el-radio>
            <el-radio v-model="createGradeCode" label="4" border>四年级</el-radio>
            <el-radio v-model="createGradeCode" label="5" border>五年级</el-radio>
            <el-radio v-model="createGradeCode" label="6" border>六年级</el-radio>
        </div>
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="newCreateClassModel"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px; margin-top:50px"
      >
        <el-form-item label="班别" prop="classCode">
          <el-input v-model="createClassCode" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="createNewClass()"
        >提交</el-button>
      </div>
    </el-dialog>
  
  </div>
</template>

<script>
    import waves from "@/directive/waves"; // waves directive
    import {fetchGradeDataListApi,fetchClassListApi,createClassApi} from '@/api/eduadmin/class-admin-api'
    export default {
        directives: { waves },
        created(){
        this.fetchGradeData()
        },
        watch: {
        // 如果 `selectedGrade` 发生改变，这个函数就会运行
        selectedGrade: function (newGrade, oldGrade) {
            console.log('new grade--',newGrade)
        this.handleGradeChange(newGrade)
        },
        createGradeCode:function(newGradeCode,oldGradeCode){
             console.log('new newGradeCode --',newGradeCode)
        }

        },

     data(){
        return {
            listLoading:false,
            tableKey:0,
            gradeDataList:[],
            tabActiveName:'',
            selectedGrade:undefined,
            dialogFormVisible:false,
            newCreateClassModel:{classCode:0,gradeCode:0},
            createClassCode:0,
            createGradeCode:0,
            specifyClassList:[{
                    classGrade:2,
                    classCode:3,
                    num:55,
                    name:'nice'
                },{
                    classGrade:2,
                    classCode:3,
                    num:55,
                    name:'nice'
                },{
                    classGrade:2,
                    classCode:3,
                    num:55,
                    name:'nice'
                }],
            rules: {
                classCode: [
                    { required: true, message: "班别不可为空", trigger: "blur" }
                ]
      },
        }
    },

    methods:{
        fetchGradeData(){
            fetchGradeDataListApi()
            .then(response=>{
                response.result.forEach(element => {
                    
                    switch(element.classGrade){
                        case 1:
                            element.gradeName = '一年级'
                            break
                         case 2:
                            element.gradeName = '二年级'
                            break
                        case 3:
                            element.gradeName = '三年级'
                            break
                        case 4:
                            element.gradeName = '四年级'
                            break
                        case 5:
                            element.gradeName = '五年级'
                            break
                        case 6:
                            element.gradeName = '六年级'
                            this.tabActiveName = element.gradeName
                            this.selectedGrade = element
                            break
                        default:
                            element.gradeName = element.classCode +'年级'
                            break
                    }
                });
                console.log('response result',response)
                this.gradeDataList=response.result

            })
            .catch(error=>{})
        },
        handleUpdate(row){},
        handleDetail(row){
            
        },
        onDeleteBtnClick(row,index){},

        handleGradeChange(newGrade){
            fetchClassListApi(newGrade.classGrade)
            .then(response=>{
                this.specifyClassList = response.result
            })
        },

        handleClick(tab, event) {
            let selectGradeCode = 0
            if(tab.name==='一年级'){
                selectGradeCode= 1
            }else if(tab.name==='二年级'){
                selectGradeCode= 2
            }else if(tab.name==='三年级'){
                selectGradeCode= 3
            }else if(tab.name==='四年级'){
                selectGradeCode= 4
            }else if(tab.name==='五年级'){
                selectGradeCode= 5
            }else if(tab.name==='六年级'){
                selectGradeCode= 6
            }else{
                selectGradeCode= tab.name.charAt(0)
            }
            this.gradeDataList.forEach(element => {
                    if(element.classGrade===selectGradeCode){
                         this.selectedGrade = element
                    }
                });
            
      },
      handleAdd(){
        console.log('handle add')
        this.createGradeCode=0
        this.createClassCode=0;
        this.dialogFormVisible = true

     },
     createNewClass(){

         if(this.createGradeCode==0){
              this.$alert('年级不能为空', '选择年级', {
                confirmButtonText: '确定',
                callback: action => {}
                });

         }else{
             console.log('start post create new class ,gradecode=',this.createGradeCode)
             createClassApi(this.createGradeCode,this.createClassCode)
             .then(response=>{
                  this.dialogFormVisible = false
                 console.log('提交成功')
                 this.fetchGradeData()
             })
             .catch(error=>{})
         }
     }
    }  

}
</script>

<style>

  .grade-summary {
    font-size: 0;
  }
  .grade-summary label {
    width: 90px;
    color: #99a9bf;
  }
  .grade-summary .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>