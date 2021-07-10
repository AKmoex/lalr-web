import React from 'react'

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './lr1.css'
import { FrownTwoTone, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import * as d3 from 'd3'
import * as d3Graphviz from 'd3-graphviz';
import Graph from "react-graph-vis";

import {
    Card,
    Form,
    Input,
    Table,
    Button,
    Tag,
    Collapse,
    message,
    Row,
    Col,
    Tabs,
    Drawer
  } from 'antd';


import axios from 'axios';

const { Panel } = Collapse;

const g1 = "E->E+T<br />E->T<br />T->T*F<br />T->F<br />F->(E)<br />F->i"
const e1="i+i*i"

class LR1 extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            nn:[],
            current_node_data:[],
            current_node:null,
            isModalVisible:false,
            columns1:[
            ],
            
            data1:[],
            columns2:[
                {
                    title: '步骤',
                    dataIndex: 'step',
                    key: 'step',
                  },
              
                  {
                    title: '状态栈',
                    dataIndex: 'status_stack',
                    key: 'status',
                  },
                  {
                      title:"符号栈",
                      dataIndex:"analyse_stack",
                      key:"analyse_stack"
                  },
                  {
                    title:"输入串",
                    dataIndex:"expression_stack",
                    key:"expression_stack"
                  },
                  {
                    title:"动作说明",
                    dataIndex:"action",
                    key:"action",
                    render: text => {
                        if(text==="ERROR"){
                            return <Tag color="#f50">{text}</Tag>
                        }
                        else if(text==="acc,分析成功"){
                            return  <Tag color="#87d068">{text}</Tag>
                        }
                        else{
                            return text
                        }
                    }
                  }
            ],
            data3:[],
            graph :{
                nodes:[],
                edges:[]
            },
            prod_data:[],
            drawerVisible:false
            
        }
        
    }
    formRef = React.createRef();

    events={
        select: ({ nodes, edges }) => {
          this.setState({
            current_node:nodes,
            current_node_data:this.state.nn[nodes]
          })
        }
      }
    render(){   
        return(
            <div className="container">
                 
                <div className="left-side">                 
                    <Card title="输入" size="small" extra={<a onClick={this.showDrawer.bind(this)}>👋 Examples</a>}>
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
                        <Panel header="分析表" key="1">
                            <Table columns={this.state.columns1} dataSource={this.state.data1} pagination={false}/>
                        </Panel>
                    </Collapse>  
                    <Collapse defaultActiveKey={0} >
                        <Panel header="状态图" key="2" style={{position:"relative"}}>
                            <Graph graph={this.state.graph} style={{height:500}} events={this.events}/>
                            
                            {this.state.current_node_data.length>=1?
                                (
                                    <Card title={`I`+this.state.current_node} bordered={false} style={{background:'#c6ffc1', width: 200,position:'absolute',top:50,right:10,boxShadow:"box-shadow: 0 0 60px rgb(0 0 0 / 10%)" }}>
                                        {this.state.current_node_data.map((item,index)=>(
                                            <p>{item}</p>
                                        ))}
                                    </Card>
                                ):null
                            }
                        </Panel>
                    </Collapse>  
                    <Collapse defaultActiveKey={0} >
                        <Panel header="分析过程" key="2">
                            <Table columns={this.state.columns2} dataSource={this.state.data2} pagination={false}/>
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
                            🛠  样例一
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
                    </Tabs>,
                    
                </Drawer>
            </div>
        )
    }
    clearForm(){
        this.formRef.current.setFieldsValue({
            grammar:"",
            expression:""
        })
    }
    // 样例一 
    Fill1(){
        this.formRef.current.setFieldsValue({
            grammar:"E->E+T\nE->T\nT->T*F\nT->F\nF->(E)\nF->i",
            expression:"i+i*i"
        });
        this.setState({
            drawerVisible:false
        })
    }

    showDrawer () {
        this.setState({
            drawerVisible:true
        })
    };
    
    onClose = () => {
        this.setState({
            drawerVisible:false
        })
    };

    analyse(){
        const key="analyse"
                
        let { validateFields } = this.formRef.current;
        validateFields().then( (value) => {
            message.loading({ content: '分析中...',key });
            axios.get('/lr1', {
                params: {
                    grammar: value.grammar?value.grammar:"",
                    expression:value.expression?value.expression:""
                },
            }).then((res)=>{

                let len=res.data.VT.length+res.data.VN.length
                
                let columns1=[]
                columns1.push({
                    title:"status",
                    dataIndex: "status",
                    key:"status"
                })
                for(let i=1;i<=len;i++){
                    let t="ch"+i
                    columns1.push({
                        title:t,
                        dataIndex: t,
                        key:t
                    })
                    
                }
                this.setState({
                    columns1,  
                })

                let data1=[
                ]
                let row1={
                    
                }
                row1["status"]=""
                for(let i=0;i<res.data.VT.length;i++){
                    let t="ch"+(i+1)
                    console.log("nihao ");
                    row1[t]=res.data.VT[i]
                }
                for(let i=0;i<res.data.VN.length;i++){
                    let t="ch"+(1+res.data.VT.length+i)
                    row1[t]=res.data.VN[i]
                }
                data1.push(row1)
                for(let i=0;i<res.data.Body.length;i++){
                    let row={
                        status:i
                    }
                    for(let j=0;j<res.data.Body[i].length;j++){
                        let t="ch"+(j+1)
                        row[t]=res.data.Body[i][j]
                    }
                    data1.push(row)
                }
                
                this.setState({
                    data1
                })
                
                // 处理分析过程
                let data2=[];
                for(let i=0;i<res.data.Process.length;i++){
                    let a=res.data.Process[i][3]
                    a=a.replace("into Stack","入栈");
                    a=a.replace("Reduce","归约");
                    a=a.replace("Success","分析成功")
                    a=a.replace("Status","状态")
                    let p={
                        "step":i+1,
                        "status_stack":res.data.Process[i][0],
                        "analyse_stack":res.data.Process[i][1],
                        "expression_stack":res.data.Process[i][2],
                        "action":a
                    }
                    data2.push(p)
                }
                this.setState({
                    data2
                })

                // 画状态图

                let graph={
                   
                }
                let nodes=[];
                let edges=[];
                for(let i=0;i<res.data.nodes.length;i++){
                    nodes.push({
                        id:res.data.nodes[i],
                        label:res.data.nodes[i].toString()
                    });
                }
                for(let i=0;i<res.data.edges.length;i++){
                    let one_edge={
                        from:res.data.edges[i][0],
                        to:res.data.edges[i][1]
                    }
                    edges.push(one_edge)
                }
                graph["nodes"]=nodes
                graph["edges"]=edges
                this.setState({
                    graph
                })
                let nn=[];
                for(let i=0;i<res.data.n.length;i++){
                   let n=[]
                    for(let j=1;j<res.data.n[i].length;j++){
                        n.push(res.data.n[i][j])
                    }
                    nn[res.data.n[i][0]]=n
                }
                this.setState({
                    nn
                })
                
                message.success({ content: '分析成功!',key, duration: 1.5 });

            })
        })
        .catch((err)=>{
            message.error({content:'文法和表达式不能为空',key, duration:1.5});
        })
    }
}

export default LR1