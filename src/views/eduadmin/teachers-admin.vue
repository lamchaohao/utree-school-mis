<template>
 <div class="app-container">

    <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd" style="margin-bottom:15px; float:right">新增</el-button>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="teacherList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="照片" prop="subjectId" sortable="custom" align="center" min-width="80">
        <template slot-scope="{row}">
            <el-avatar shape="square" :size="80" :fit="'contain'" :src="dpath + row.filePath"></el-avatar>

        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="性别" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.gender }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="手机号码" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone  }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="入职时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.entryTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="任教科目" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.subjectName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否班主任" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.state }}</el-tag>
        </template>
      </el-table-column>

       <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.teacherStatus }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width" type=index>
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="success" @click="handleDetail(row)">详情</el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="onDeleteBtnClick(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getTeacherList"
    />
<el-dialog
  title="删除教师"
  :visible.sync="deleteDialogVisible"
  width="30%">
  <span>是否删除"{{tableKey}}"</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleDelete ">确 定</el-button>
  </span>
</el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="editDialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempTeacher"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
      <!-- prop="subjectName" -->
        <el-form-item label="姓名" prop="teacherName" >  
          <el-input v-model="tempTeacher.subjectName" />
        </el-form-item>
         <el-form-item label="性别" prop="gender" >  
          <el-input v-model="tempTeacher.subjectName" />
        </el-form-item>
         <el-form-item label="身份证号码" prop="idNum" >  
          <el-input v-model="tempTeacher.subjectName" />
        </el-form-item>
        <el-form-item label="入职日期" prop="workdate" >  
          <el-date-picker v-model="value1" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="可教科目" prop="subjects" >  
             <el-checkbox-group v-model="tempTeacher.checkList">
                <el-checkbox label="复选框 A"></el-checkbox>
                <el-checkbox label="复选框 B"></el-checkbox>
                <el-checkbox label="复选框 C"></el-checkbox>
                <el-checkbox label="禁用" disabled></el-checkbox>
                <el-checkbox label="选中且禁用" disabled></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createNewTeacher():updateTeacherData()"
        >提交</el-button>
      </div>
    </el-dialog>


  </div>

</template>

<script>

import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { parseTime } from "@/utils";
import waves from "@/directive/waves"; // waves directive
import {fetchTeacherList,fetchTeacherListWithPage} from '@/api/eduadmin/teacher-admin-api'
import{getDPath} from '@/utils/auth'
export default {
    directives: { waves },
  created() {
    this.getTeacherList();
  },
    components:{Pagination},
    data(){
        return {
        listLoading: true,
        teacherList: null,
        listQuery: {
            page: -1,
            limit: 10,
            importance: undefined,
            title: undefined,
            type: undefined,
            sort: "+id"
        },
        teacherToDelete:undefined,
        deleteDialogVisible:false,
        tableKey: 0,
        total: 0,
        dpath:getDPath(),
        editDialogFormVisible:false,
        dialogStatus: "create",
        textMap: {
            update: "编辑",
            create: "新增"
        },
        tempTeacher:{name:'',checkList: ['选中且禁用','复选框 A']},
        rules: {
            teacherName: [
            { required: true, message: "科目名称是必填的", trigger: "blur" }
            ]
        },
    }
       
    },

    methods:{
        getTeacherList:function(){
            if(this.listQuery.page==-1){
                fetchTeacherList().then(response=>{
                    this.listLoading = false;
                    this.total = response.result.count;
                    this.teacherList = response.result.list
                    this.listQuery.page=response.result.page
                }).catch(error=>{

            });
            }else{
                console.log('this.listQuery.page = ',this.listQuery.page)
                fetchTeacherListWithPage(this.listQuery.page,this.listQuery.limit)
                .then(response=>{
                    this.listLoading = false
                    this.total = response.result.count;
                    this.teacherList = response.result.list
                })
                .catch(error=>{

                })
            }
            

        },
        handleAdd: function() {
            this.editDialogFormVisible=true;
        },

        handleDelete:function(){},

        createNewTeacher(){},

        updateTeacherData(){}


    }
}
</script>

<style>

</style>