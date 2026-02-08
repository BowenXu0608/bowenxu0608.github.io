---
title: week 11 notes

---

# Week 11 Notes
This week will focus on the details in the graphics pipeline and understand how it really works and which steps can be optimized.

## Part one: Application Stage
As we know, the application stage can be understood as the process where the information in the application is converted into a document, such as an .obj file, which is then sent to the GPU so that the GPU can interpret the data.

Now, we need to divide this stage into different steps. First of all, the process of packing the data and sending it to the GPU is called a "draw call".  In fact, after you create the graphs and decide to send them, the data for those graphs is stored in a command buffer, and the command buffer will be sent to the GPU. When the GPU receives the command buffer, it understands that something needs to be drawn and reads the data accordingly.

### Optimization Point one
Obviously, to optimize the performance of the pipeline, we should first reduce the number of drawings. The fewer graphs required at this stage, the better the performance will be.

After the draw call, the second step in the application stage is input assembly. This step determines how the GPU interprets the data. For example, the GPU needs to know which parts of the data represent vertices, the step size, and how to recognize the vertices stored in the vertex shader. Overall, during this step, the Vulkan device reads the index and vertex buffers that contain information about the vertices being drawn.

## Part two: Vertex Stage
The purpose of the vertex stage is to use the MVP transformation to convert vertices from object space to screen space. (objuct space -(model matrax)-> world space -(view matrax)-> camera space -(project matrax)-> screen space).

However, if a detailed model has a massive number of vertices, it will be difficult to process. There are two main reasons: first, the vertex shader is executed once per vertex. As a result, the more vertices there are, the more the vertex shader will be used. Additionally, the greater the number of vertices, the more memory and bandwidth are required to store and transfer them.

To solve this problem, we create a technique called tessellation. This technique is used to increase the number of vertices after sending a mesh into the vertex shader, allowing us to use less vertices in the vertex shader and transport them. there are three steps in the tessellation, and only the first and the third step can be controlled by programmers. The first step is hull shader (a.k.a. tessellation control shader). The hull shader determines the tessellation factors, such as the number of vertices and the scale to be used. After this, the data will be processed in a fix function, which means that programmer cannot control it. Actually, in this fix function, there are many algorithms recorded in the GPU in advance, and GPU can use them in a very high speed. After this step, the number of vertices will be enlarged in the way we set in the hull shader. Then this new data set is sent to the domain shader (a.k.a.tessellation evaluation shader). In the domain shader, the new vertices will be processed like what vertex shader does. Concentration on the difference between the domain shader and the vertex shader: vertex shader processes the original vertices, which it get from draw call. Domain shader processes the new vertices, which it get from hull shader. As a result, domain shader do not need to fetch information from memory, saving time by avoiding data transfer between memory and the GPU. Remember, the hull shader and fixed-function stage increase the number of faces in object space, which is why the domain shader is necessary to transform them.

Moreover, there is an optional shader we can use called a geometry shader. The function of this shader is not to create more vertices, but to generate additional faces (triangles). It has three different cases. The first one is 1 triangle -> 10 triangles, the second one is 1 vertex -> 1 triangle, and the last one is discarding a triangle. This can be useful, for example, if you need to create a weed—you can just create one triangle and use the geometry shader to generate 10 triangles. However, due to its instability, we can only use it during prototyping. You can imagine the problems it causes: because the number of triangles is unstable, the shader cannot rely on a stable feet size to control the data, which can significantly slow processing speed and easily cause errors. This limitation means that the geometry shader can never be used in the final version.

After these steps, the vertices are prepared and ready. Next, we need a primitive assembly step to reconnect the vertices into faces. The reason for this step is to confirm all the triangles so that we know how to clip them when displaying on the screen.

![image](https://hackmd.io/_uploads/SkmdJfUwWg.png)

From this picture, we can understand the usefulness of the primitive assembly step. The next step is clip and cull. In this step, we clip the scene and determine which triangles need to be rendered. In the left example, we see that the triangle should be rendered and clipped. In the right example, we can confirm that the triangle does not need to be rendered, and the triangle on the screen does not need to be clipped. Notably, the clip and cull step is a fixed function, meaning that programmers cannot control this step as it is predefined by the GPU.

## Rasterization Stage
This step involves no additional processes; everything as we know. We need to split the graph into individual fragments. Between the rasterization stage and the pixel stage, we add a fragment assembly step, which uses the techniques like interpolation, changes the date set from vertices to fragments.

## Pixel Stage
This step also has no extra process, as we all know, using the information of each fragment to complete rendering process.

## Frame Buffer Stage
In the final stage, we typically perform three tests: alpha test, depth test, and stencil test. Nowadays, there is not a certain buffer for the alpha test. Insteadedly, there is a discard() demand in the shader to determine which fragments should not be shown. The basic principle of the alpha test is to check the alpha clip threshold; if the alpha value is below this threshold, the fragment is discarded. After that, the stencil test is performed, followed by the depth test. Due to the expensive cost, color blending is the last process in the pipeline.

### Optimization Point two
Because the results of fragment shader will not influence these tests, to reduce the waste, we can conduct these tests before pixel stage (early-z) so that the fragment shader do not have to process the fragments that will be discarded. However, because some materials have transparency, which means although the fragments behind it will not be shown in the screen, they will influence the color of the front fragments, the early-z may be unsuitable sometimes. This problem cannot be solved now, programmers should consider the environment they are to determine if early-z is suitable.

Finally, we can get this graph to discribe the whole process:
![image](https://hackmd.io/_uploads/H1vU3M8Dbl.png)

Remember, in the Vulkan, only the vertex shader is necessary, other process can be empty.

## In Vulkan
### Draw Call
![image](https://hackmd.io/_uploads/BJTBaGIPbe.png)
From the graph, we can see how Vulkan creates a draw call. The VkCommandBuffer is a command buffer used to store information, as what we see at first. Another important thing is firstInstance. When you need to create repetitive objects, using the pipeline every time is expensive. As a result, we can just use the instance to efficiently create multiple copies of the same object.