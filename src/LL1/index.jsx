import React from 'react'

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './ll1.css'
import { FrownTwoTone, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Tree from 'react-d3-tree';

import {
    Card,
    Form,
    Input,
    Row,
    Col,
    Select,
    DatePicker,
    Table,
    Popconfirm,
    Button,
    Tooltip,
     Tag, Space,
     Modal,
     Collapse,
     message
  } from 'antd';


import axios from 'axios';
const { Panel } = Collapse;

class LL1 extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            data:[
                
            ],
            table_header:[],
            table_body:[],
            first_columns:[
                {
                    title: '非终结符',
                    dataIndex: 'vn',
                    key: 'vn',
                },
                {
                    title: 'FIRST集',
                    dataIndex: 'first',
                    key: 'first',
                },
            ],
            follow_columns:[
                {
                    title: '非终结符',
                    dataIndex: 'vn',
                    key: 'vn',
                },
                {
                    title: 'FOLLOW集',
                    dataIndex: 'follow',
                    key: 'follow',
                },
            ],
            first:[

            ],
            follow:[

            ],
            dataSource : [
                {
                  key: '1',
                  name: '胡彦斌',
                  age: 32,
                  address: '西湖区湖底公园1号',
                },
                {
                  key: '2',
                  name: '胡彦祖',
                  age: 42,
                  address: '西湖区湖底公园1号',
                },
            ],
            treeData : {
            },
            grammar_columns:[
                {
                    title: '文法编号',
                    dataIndex: 'grammar_index',
                    key: 'grammar_index',
                },
                {
                    title: '文法',
                    dataIndex: 'grammar',
                    key: 'grammar',
                },
            ],
            new_grammar:[

            ]
        }
        
    }



    
    formRef = React.createRef();
    

    render(){
        const columns = [
            {
              title: '步骤',
              dataIndex: 'step',
              key: 'step',
            },
            {
              title: '分析栈',
              key: 'analysis_stack',
              dataIndex: 'analysis_stack',
            },
            {
              title: '剩余输入串',
              key: 'input_string',
              dataIndex:'input_string'
            },
            {
                title: '所用产生式',
                key: 'prod',
                dataIndex:'prod'
            },
            {
                title: '动作',
                key: 'action',
                dataIndex:'action'
              },
        ];
        return(
            <div className="container">
                <div className="left-side">                 
                    <Card title="输入" size="small">
                        <Form layout="vertical" ref={this.formRef}>
                            <Form.Item label="输入文法" name="grammar" rules={[{ required: true, message: '文法不能为空' }]}>
                                <Input.TextArea style={{height:"200px"}}></Input.TextArea>
                            </Form.Item>
                            <Form.Item label="输入表达式" name="expression" rules={[{ required: true, message: '表达式不能为空' }]}>
                                <Input style={{height:"40px"}}></Input>
                            </Form.Item>
                        </Form>
        
                        <Row justify="end" gutter={16}>     
                            <Col>
                                <Button type="danger" onClick={this.clearForm.bind(this)} >清空</Button>
                            </Col>
                            <Col>
                                <Button type="primary" onClick={this.analyse.bind(this)}>分析</Button>
                            </Col>
                        </Row>
                    </Card>
                </div>
                <div className="right-side">
                <Collapse defaultActiveKey={0} >
                        <Panel header="消除左递归、提取公因子后的文法" key="1">
                            <Table dataSource={this.state.new_grammar} columns={this.state.grammar_columns} />
                        </Panel>
                    </Collapse> 
                    <Collapse defaultActiveKey={0} >
                        <Panel header="First集" key="2">
                            <Table dataSource={this.state.first} columns={this.state.first_columns} />
                        </Panel>
                    </Collapse> 
                    <Collapse defaultActiveKey={0} >
                        <Panel header="Follow集" key="3">
                            <Table dataSource={this.state.follow} columns={this.state.follow_columns} />
                        </Panel>
                    </Collapse>
                    <Collapse defaultActiveKey={0} >
                        <Panel header="预测分析表" key="4">
                            <Table dataSource={this.state.table_body} columns={this.state.table_header} />
                        </Panel>
                    </Collapse>    
                    <Collapse defaultActiveKey={0} >
                        <Panel header="分析过程" key="5">
                        <Table columns={columns} dataSource={this.state.data} pagination={false}/>
                        </Panel>
                    </Collapse> 
                    <Collapse defaultActiveKey={0} >
                        <Panel header="分析树" key="6" >
                            <div className="tree">
                                <Tree data={this.state.treeData} orientation='vertical'/>
                            </div>
                        </Panel>
                    </Collapse> 
    
                </div>
            </div>
        )
    }
    clearForm(){
        this.formRef.current.setFieldsValue({
            grammar:"",
            expression:""
        })
    }

    // 递归构建树
    
    ParserTree=(pt, production) =>{ 

        var p = production.match(/([A-Z])->(.*)/);

        var noTerminal = p[1], Right = p[2];
        if(typeof pt['name'] === "undefined") {
            pt['name'] = noTerminal
            pt['children'] = [];
            for(var i=0; i< Right.length; ++i)
                pt['children'].push({name: Right[i] });
            return true;
        } else {
            if(pt['name'] != noTerminal) {
                if(typeof pt['children'] != "undefined")
                    for(var i=0, len=pt['children'].length;  i < len; ++i) {
                        var child = pt['children'][i];
                        if(this.ParserTree(child, production))
                            return true;
                    }
            }
            else {
                if(typeof pt['children'] === "undefined") {
                    pt['children'] = [];
                    for(var i=0; i< Right.length; ++i)
                        pt['children'].push({name: Right[i] });
                    return true;
                } else {
                    for(var i=0, len=pt['children'].length;  i < len; ++i) {
                        var child = pt['children'][i];
                        if(this.ParserTree(child, production))
                            return true;
                    }

                }
            }
        }
    }



    analyse(){
        const key="analyse"
        let { validateFields } = this.formRef.current;
        validateFields().then( (value) => {
            message.loading({ content: '分析中...',key });

            axios.get('/ll1', {
                params: {
                    grammar: value.grammar?value.grammar:"",
                    expression:value.expression?value.expression:""
                },
            }).then((res)=>{
                
                // 新的文法
                let new_grammar=[];
                for(let i=0;i<res.data.new_grammars.length;i++){
                    new_grammar.push({
                        grammar_index:i+1,
                        grammar:res.data.new_grammars[i]
                    })
                }
                this.setState({
                    new_grammar
                })
                // 分析过程
                let newData=res.data.Steps.map((item,index)=>{
                    let arr=item.split(" ")
                    return({
                        step:index,
                        analysis_stack:arr[0],
                        input_string:arr[1],
                        prod:arr[2],
                        action:arr[3]
                    })
                })
                this.setState({
                    data:newData
                })

                // FIRST集
                let first_data=[]
                for(let one_vn in res.data.FIRST) {
                    
                    let s="";
              
                    for(let j=0;j<res.data.FIRST[one_vn].length;j++){

                        s+=res.data.FIRST[one_vn][j]+" ";
                    }
                    let a={
                        "vn":one_vn,
                        "first":s
                    }
                    first_data.push(a)
               }

               // FOLLOW集
               let follow_data=[]
                for(let one_vn in res.data.FOLLOW) {
                    
                    let s="";
              
                    for(let j=0;j<res.data.FOLLOW[one_vn].length;j++){

                        
                        s+=res.data.FOLLOW[one_vn][j]+" ";
                    }
                    let a={
                        "vn":one_vn,
                        "follow":s
                    }
                    follow_data.push(a)
               }
               this.setState({
                   first:first_data,
                   follow:follow_data
               })

               // 预测分析表
               let table_header=[]
              
               table_header.push({
                   title:"终结符",
                   dataIndex:"vn"
               })
               for(let i=0;i<res.data.Table_header.length;i++){
                    let t="ch"+(i+1)
                    table_header.push({
                        title:t,
                        dataIndex:t
                    })
               }
               let table_body=[]
               let row1={}
               row1["vn"]=""
               for(let i=0;i<res.data.Table_header.length;i++){
                    let t="ch"+(i+1)
                    row1[t]=res.data.Table_header[i]
               }
               table_body.push(row1)
               for(let one_vn in res.data.Table_body){
                   let row={
                       "vn":one_vn
                   }
                   for(let j=0;j<res.data.Table_body[one_vn].length;j++){
                       let t="ch"+(j+1)
                       row[t]=res.data.Table_body[one_vn][j]
                   }
                   table_body.push(row)
               }
               
               this.setState({
                table_header,
                table_body
               })

        

            // 分析树
            var treeData = {};
            
            
                if(res.data.success){
                    for(let i=0;i<res.data.Steps.length;i++){
                        let arr=res.data.Steps[i].split(" ")
                        let prod=arr[2]
                        if(prod!=""){ 
                            this.ParserTree(treeData, prod);
                        }
                      
                    }
                }
            
            
               this.setState({
                   treeData
               })
               message.success({ content: '分析成功!',key, duration: 1.5 });
               
            })
           

        })
        .catch((err)=>{
            message.error({content:'文法和表达式不能为空',key, duration:1.5});
        })
    }
}

export default LL1
