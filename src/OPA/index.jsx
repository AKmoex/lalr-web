import React from 'react'

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './opa.css'
import { FrownTwoTone, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Tree from 'react-d3-tree';

import {
    Card,
    Form,
    Input,
    Table,
    Button,
    Tag,
    Row,
    Col,
    Collapse,
    message,
    Drawer,
    Tabs
  } from 'antd';


import axios from 'axios';
const { Panel } = Collapse;

const g1="E->E+T|T<br />T->T*F|F<br />F->(E)|i"
const e1="i+i"

const g2="S->a|^|(T)<br />T->T,S|S"
const e2="(a,(a,a))"

class OPA extends React.Component{
    
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
                    title: 'FIRSTVT集',
                    dataIndex: 'firstvt',
                    key: 'firstvt',
                },
            ],
            last_columns:[
                {
                    title: '非终结符',
                    dataIndex: 'vn',
                    key: 'vn',
                },
                {
                    title: 'LASTVT集',
                    dataIndex: 'lastvt',
                    key: 'lastvt',
                },
            ],
            first:[

            ],
            follow:[

            ],

            treeData : {
            },
            drawerVisible:false

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
              render: text => {
                if(text==="ERROR"){
                    return <Tag color="#f50">{text}</Tag>
                }
                else if(text==="ACCEPT"){
                    return  <Tag color="#87d068">{text}</Tag>
                }
                else{
                    return text
                }
            }
            },
            {
              title: '剩余输入串',
              key: 'input_string',
              dataIndex:'input_string',
              render: text => {
                if(text==="ERROR"){
                    console.log("ERROR")
                    return <Tag color="#f50">{text}</Tag>
                }
                else if(text==="ACCEPT"){
                    console.log("accept")

                    return  <Tag color="#87d068">{text}</Tag>
                }
                else{
                    console.log({text});
                    console.log("WU")
                    return text
                }
            }
            },
            {
                title:"动作说明",
                dataIndex:"action",
                key:"action",
                render: text => {
                    if(text==="ERROR"){
                       
                        return <Tag color="#f50">{text}</Tag>
                    }
                    else if(text==="ACCEPT"){
                        return  <Tag color="#87d068">{text}</Tag>
                    }
                    else{
                        return text
                    }
                }
            },
            {
                title: '所用产生式',
                key: 'prod',
                dataIndex:'prod'
            },
        ];
        return(
            <div className="container">
                <div className="left-side">                 
                    <Card title="算符优先分析法" size="small" extra={<a onClick={this.showDrawer.bind(this)}>👋 Examples</a>}>
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
                                <Button type="danger" onClick={this.clearForm.bind(this)}>清空</Button>
                            </Col>
                            <Col>
                                <Button type="primary" onClick={this.analyse.bind(this)}>分析</Button>
                            </Col>
                        </Row>

                    </Card>
                </div>
                <div className="right-side">
        
                    <Collapse defaultActiveKey={0} >
                        <Panel header="FIRSTVT集" key="2">
                            <Table dataSource={this.state.first} columns={this.state.first_columns} />
                        </Panel>
                    </Collapse> 
                    <Collapse defaultActiveKey={0} >
                        <Panel header="LASTVT集" key="3">
                            <Table dataSource={this.state.follow} columns={this.state.last_columns} />
                        </Panel>
                    </Collapse>
                    <Collapse defaultActiveKey={0} >
                        <Panel header="算符优先分析表" key="4">
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
                <Drawer
                    title="🗃 Examples"
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.drawerVisible}
                    width={400}
                >
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane
                        tab={
                            <span>
                            💻  样例一
                            </span>
                        }
                        key="1"
                        >
                        <Card size={'small'}>
                            <Card title="文法" bordered={false} size={'small'}>
                                <p dangerouslySetInnerHTML={{__html: g1}}></p>
                            </Card>
                            <Card title="表达式" bordered={false} size={'small'}>
                                <p dangerouslySetInnerHTML={{__html: e1}}></p>
                            </Card>
                            <Row justify="end">     
                                <Col>
                                    <Button type="link" style={{marginRight:'10px'}} size={'large'} onClick={this.Fill1.bind(this)}>Fill</Button>
                                </Col>
                            </Row>
                        </Card>
                        </Tabs.TabPane>
                        <Tabs.TabPane
                        tab={
                            <span>
                            🖨  样例二
                            </span>
                        }
                        key="2"
                        >
                            <Card size={'small'}>
                                <Card title="文法" bordered={false} size={'small'}>
                                    <p dangerouslySetInnerHTML={{__html: g2}}></p>
                                </Card>
                                <Card title="表达式" bordered={false} size={'small'}>
                                    <p dangerouslySetInnerHTML={{__html: e2}}></p>
                                </Card>
                                <Row justify="end">     
                                    <Col>
                                        <Button type="link" style={{marginRight:'10px'}} size={'large'} onClick={this.Fill2.bind(this)}>Fill</Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Tabs.TabPane>
                        
                    </Tabs>,
                    
                </Drawer>
            </div>
        )
    }
    onClose = () => {
        this.setState({
            drawerVisible:false
        })
    };
    showDrawer () {
        this.setState({
            drawerVisible:true
        })
    };
    // 样例一 
    Fill1(){
        this.formRef.current.setFieldsValue({
            grammar:"E->E+T|T\nT->T*F|F\nF->(E)|i",
            expression:"i+i"
        });
        this.setState({
            drawerVisible:false
        })
    }
    // 样例二 
    Fill2(){
        this.formRef.current.setFieldsValue({
            grammar:"S->a|^|(T)\nT->T,S|S",
            expression:"(a,(a,a))"
        });
        this.setState({
            drawerVisible:false
        })
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
            
            axios.get('/opa', {
                params: {
                    grammar: value.grammar?value.grammar+"\n#\n":"",
                    expression:value.expression?value.expression+"#":"#"
                },
            }).then((res)=>{

                // FIRSTVT集
                console.log(res.data);
                let first_data=[]
                for(let one_vn in res.data.FIRSTVT) {
                    let s="";
                    for(let j=1;j<res.data.FIRSTVT[one_vn].length;j++){
                        s+=res.data.FIRSTVT[one_vn][j]+"  ";
                    }
                    let a={
                        "vn":res.data.FIRSTVT[one_vn][0],
                        "firstvt":s
                    }
                    first_data.push(a)
               }

               // LASTVT集
               let last_data=[]
                for(let one_vn in res.data.LASTVT) {
                    let s="";
                    for(let j=1;j<res.data.LASTVT[one_vn].length;j++){
                        s+=res.data.LASTVT[one_vn][j]+"  ";
                    }
                    let a={
                        "vn":res.data.LASTVT[one_vn][0],
                        "lastvt":s
                    }
                    last_data.push(a)
               }
               this.setState({
                   first:first_data,
                   follow:last_data
               })

                 // 预测分析表
                 let table_header=[]
              
                 table_header.push({
                     title:" ",
                     dataIndex:"ch0"
                 })
                 for(let i=1;i<res.data.Table_header.length;i++){
                      let t="ch"+(i)
                      table_header.push({
                          title:res.data.Table_header[i],
                          dataIndex:t
                      })
                 }
                 let table_body=[]
                
                 for(let i=0;i<res.data.Table_body.length;i++){
                     let row={};
                     for(let j=0;j<res.data.Table_body[i].length;j++){
                        let t="ch"+(j);
                        if(res.data.Table_body[i][j]=="\u0000"){
                            row[t]=" ";
                        }
                        else{
                            row[t]=res.data.Table_body[i][j];
                        }
                     }
                     table_body.push(row)
                 }

                 this.setState({
                  table_header,
                  table_body
                 })

                
                // 分析过程
                let newData=res.data.Process.map((item,index)=>{
                   
                    let prod;
                    if(item[2]=="Reduce"){
                        prod=item[3]+"->"+item[4]
                    }
                    else{
                        prod="";
                    }
                    return({
                        step:index,
                        analysis_stack:item[0],
                        input_string:item[1].split("\u0000"),
                        action:item[2],
                        prod
                    })
                })
                this.setState({
                    data:newData
                })

        
            // 语法树
            let lst=[];

            for(let i=0;i<res.data.Process.length;i++){
                if(res.data.Process[i][2]==="Move"){
                    lst.push({
                        name:res.data.Process[i][1][0],
                        children:[]
                    })
                }
                else if(res.data.Process[i][2]==="Reduce"){
                    let len=res.data.Process[i][4].length;
                    let children=[]
                    for(let j=len;j>0;j--){
                        children.push(lst[lst.length-j])
                    }
                    for(let j=0;j<len;j++){
                        lst.pop();
                    }
                    lst.push({
                        name:res.data.Process[i][3],
                        children:children
                    })
                }
                else{
                    break;
                }
                
            }
            this.setState({
                treeData:lst[0]
            })

               
            })
            message.success({ content: '分析成功!',key, duration: 1.5 });

        })
        .catch((err)=>{
            message.error({content:'文法和表达式不能为空',key, duration:1.5});
        })
    }
}

export default OPA
