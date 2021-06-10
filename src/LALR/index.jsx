import React from 'react'

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './lalr.css'
import { FrownTwoTone, MinusCircleOutlined, PlusOutlined,SmileOutlined } from '@ant-design/icons';

import * as d3 from 'd3'
import * as d3Graphviz from 'd3-graphviz';
import Graph from "react-graph-vis";
import Tree from 'react-d3-tree';


import {
    Card,
    Form,
    Input,
    Table,
    Button,
     Tag,
     Collapse,
     message,
     notification,
   
  } from 'antd';


import axios from 'axios';
import { interpolate } from 'd3';
const { Panel } = Collapse;

class LALR extends React.Component{
    
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
            treeData : {
                
            },

            // 测试 语法树
            d:[
                ["s","i"],
                ["r","i","F"],
                ["r","F","T"],
                ["r","T","E"],
                ["s","+"],
                ["s","i"],
                ["r","i","F"],
                ["r","F","T"],
                ["s","*"],
                ["s","i"],
                ["r","i","F"],
                ["r","T*F","T"],
                ["r","E+T","E"]
            ]
            
        }
        
    }


   
    
    formRef = React.createRef();

    events={
        select: ({ nodes, edges }) => {
        let d=this.state.nn[nodes[0]];
        if(typeof(nodes[0])!="undefined"){
            this.setState({
                current_node_data:d,
                current_node:nodes[0],
                
            })
        }
        console.log(this.state.current_node_data);
        
        }
      }
    render(){   
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
                        <Button type="danger" onClick={this.clearForm.bind(this)} className="btn">清空</Button>
                        <Button type="primary" onClick={this.analyse.bind(this)}>分析</Button>
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
                        <Panel header="分析树" key="6" >
                            <div className="tree">
                                <Tree data={this.state.treeData} orientation='vertical'/>
                            </div>
                        </Panel>
                    </Collapse> 
                    
                    <Collapse defaultActiveKey={0} >
                        <Panel header="分析过程" key="3">
                            <Table columns={this.state.columns2} dataSource={this.state.data2} pagination={false}/>
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
    analyse(){
        const key="analyse"
                
        let { validateFields } = this.formRef.current;
        validateFields().then( (value) => {
            message.loading({ content: '分析中...',key });
            axios.get('/lalr', {
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
                        from:parseInt(res.data.edges[i][0]),
                        to:parseInt(res.data.edges[i][1]),
                        label:res.data.edges[i][2]
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

                // 画语法树
                let lst=[];

                // 若最后一项是一个空数组,则表明表达式可以推导出来
                if(res.data.Tree[res.data.Tree.length-1].length==0){
                    for(let i=0;i<res.data.Tree.length-1;i++){
                        if(res.data.Tree[i][0]=="s"){
                            lst.push({
                                name:res.data.Tree[i][1],
                                children:[]
                            })    
                        }
                        else{
                            let len=res.data.Tree[i][1].length;
                            let children=[]
                            for(let j=len;j>0;j--){
                                children.push(lst[lst.length-j])
                            }
                            for(let j=0;j<len;j++){
                                lst.pop();
                            }
                            lst.push({
                                name:res.data.Tree[i][2],
                                children:children
                            })
                        }
                    
                    }
                    this.setState({
                        treeData:lst[0]
                    })
                }
                // 最后一项不是空数组,则说明表达式推导过程中出现错误
                else{
                    for(let i=0;i<res.data.Tree.length-1;i++){
                        // 移进过程
                        if(res.data.Tree[i][0]=="s"){
                            lst.push({
                                name:res.data.Tree[i][1],
                                children:[]
                            })    
                        }
                        // 归约过程
                        else if(res.data.Tree[i][0]=="r"){
                            let len=res.data.Tree[i][1].length;
                            let children=[]
                            for(let j=len;j>0;j--){
                                children.push(lst[lst.length-j])
                            }
                            for(let j=0;j<len;j++){
                                lst.pop();
                            }
                            lst.push({
                                name:res.data.Tree[i][2],
                                children:children
                            })
                        }      
                    }
                    // 单独处理最后的出错步骤
                    
                    for(let b=0;b<res.data.Tree[res.data.Tree.length-1][1].length-1;b++){
                        lst.push({
                            name:res.data.Tree[res.data.Tree.length-1][1][b],
                            children:[],
                        })
                    }
                    console.log(lst);
                    this.setState({
                        treeData:lst[0]
                    })
                }
                
                
                

                message.success({ content: '分析成功!',key, duration: 1.5 });

                // 右上角提示
                let t
                if(res.data.type=="LALR"){
                    t=(<span>该文法的所有项目集族合并后均无  <Tag color="magenta">归约-归约</Tag>错误,故可以采用 <Tag color="green">LALR</Tag>分析法分析</span>)
                }
                else{
                    t=(<span>该文法的所有项目集族合并后存在  <Tag color="magenta">归约-归约</Tag>错误,故自动切换为 <Tag color="green">LR1</Tag>分析法分析</span>)
                }
                notification.open({
                    message: '🎉Analyse Success !',
                    description:t,
                    duration: 2.8,
                });
                

            })
        })
        .catch((err)=>{
            message.error({content:'文法和表达式不能为空',key, duration:1.5});
        })
    }
}

export default LALR



