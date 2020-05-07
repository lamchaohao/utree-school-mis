<template>
  <div class="app-container">
    <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="subjectId" sortable="custom" align="center" min-width="80">
        <template slot-scope="{row}">
          <span>{{ row.subjectId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科目" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.subjectName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作员" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.reviser }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="修改时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
<!-- 
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    /> -->
<el-dialog
  title="删除科目"
  :visible.sync="deleteDialogVisible"
  width="30%">
  <span>是否删除"{{subjectToDelete.subjectName}}"</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleDelete ">确 定</el-button>
  </span>
</el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="科目名称" prop="subjectName">
          <el-input v-model="temp.subjectName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createNewSubject():updateSubjectData()"
        >提交</el-button>
      </div>
    </el-dialog>


<!-- Form -->
    <el-dialog title="操作记录" :visible.sync="detailDialogTableVisible"  border
      fit
      highlight-current-row
      style="width: 100%;">
  <el-table :data="detailData">
    <el-table-column property="types" label="操作类型" width="150">
        <template slot-scope="{row}">
          <span>{{ row.types===0?'创建':'修改'}}</span>
        </template></el-table-column>
    <el-table-column property="name" label="操作详情" width="200">
         <template slot-scope="scope">
          <el-tag type='success'
          disable-transitions>{{scope.row.oldName}} ====>>>{{scope.row.newName}} </el-tag>
          
      </template>
    </el-table-column>
    <el-table-column property="operator" label="操作人" width="150"></el-table-column>
    <el-table-column label="操作时间" >
         <template slot-scope="{row}">
        <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
         </template>
    </el-table-column>
  </el-table>
</el-dialog>


  </div>
</template>

<script>
import { fetchSubjectList, createSubjectApi,updateSubjectApi,deleteSubjectApi ,detailForSubject} from "@/api/eduadmin/subjects";
import { parseTime } from "@/utils";

import waves from "@/directive/waves"; // waves directive

export default {

  directives: { waves },
  created() {
    this.getList();
  },
  data() {
    return {
      listLoading: true,
      list: null,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      tableKey: 0,
      total: 0,
      subjectToDelete:{subjectId:'',subjectName:'',index:-1},
      showReviewer: false,
      temp: {
        subjectId: '',
        subjectName: ''
      },
      dialogFormVisible: false,
      deleteDialogVisible:false,
      detailDialogTableVisible:false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新增"
      },
      rules: {
        subjectName: [
          { required: true, message: "科目名称是必填的", trigger: "blur" }
        ]
      },
      detailData:[]
    };
  },
  methods: {
    getList() {
      this.listLoading = true;
      console.log("get list ()");
      fetchSubjectList()
        .then(response => {
          console.log("response", response);
          this.list = response.result;
          this.total = response.result.length;
          this.listLoading = false;
        })
        .catch(error => {
          console.log("fetch subject error---", error);
        });
    },

    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
    handleAdd: function() {
      this.dialogStatus = "create";

      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    createNewSubject: function() {
    this.$refs["dataForm"].validate(valid => {
      if (valid) {
        const tempData = Object.assign({}, this.temp);
        console.log('createNewSubject tempData=',tempData)
        createSubjectApi(tempData.subjectName)
          .then((response) => {
            console.log('createNewSubject response',response)
            this.dialogFormVisible = false;
            this.getList() //重新获取数据
            this.$notify({
              title: "Success",
              message: "添加科目成功",
              type: "success",
              duration: 2000
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    })},

    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateSubjectData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
            console.log('temp',tempData)
            let tempSub = {subjectId:tempData.subjectId,subjectName:tempData.subjectName}
          updateSubjectApi(tempSub).then((response) => {
            console.log('updateSubjectApi response',response)
            this.dialogFormVisible = false;
            this.list.forEach(element => {
                if(element.subjectId===tempData.subjectId){
                    element.subjectName = tempData.subjectName
                }
            });
            this.$notify({
              title: "Success",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          })
          .catch(error => {
            console.log(error);
          });
        }
      });
    },

    handleDetail(row){
        console.log('handleDetail--',row)
        this.detailDialogTableVisible=true
        detailForSubject()
        detailForSubject(row.subjectId).then((response) => {
            console.log('detailForSubject response',response)
            this.detailDialogTableVisible = true;
            this.detailData = response.result;
          })
          .catch(error => {
            console.log(error);
          });
    },

    onDeleteBtnClick(row, index){
        this.deleteDialogVisible=true
        this.subjectToDelete.subjectId=row.subjectId;
        this.subjectToDelete.subjectName = row.subjectName
        this.subjectToDelete.index=index;
        console.log('subjectToDelete',this.subjectToDelete,index)
    },

    handleDelete() {
        deleteSubjectApi(this.subjectToDelete.subjectId)
        .then((response)=>{
            this.$notify({
              title: "成功",
              message: "删除"+this.subjectToDelete.subjectName+'成功',
              type: "success",
              duration: 2000
            });
            this.list.splice(this.subjectToDelete.index, 1)
            this.deleteDialogVisible=false
        }).catch(error=>{
             console.log('delete error ',error)
             this.deleteDialogVisible=false
        })
    //   this.$notify({
    //     title: 'error',
    //     message: '删除未接入接口',
    //     type: 'error',
    //     duration: 2000
    //   })
    //   this.list.splice(index, 1)
    },

    

  },

};
</script>

<style>
</style>