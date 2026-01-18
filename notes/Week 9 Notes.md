---
title: Week 9 Notes

---

# Week 9 Notes
This week we mainly talk about color and image.
## Part one: color
We have three aspects to understand the color: radiometry, photometry and colorimetry. Radiometry thinks color represents electromagnetic radiation, we can determine a color by the wavelength of light. Photometry thinks that colors are just a feeling of wavelength for people, which can be very subjective and relies on people's sense organs. The last one, colorimetry, thinks that color represents a psychological reaction to a certain physical stimulation. It is not objective, futher more, it is only based on the psychological reaction, but not any physical data.

![2025-01-18-095211.png](images/2025-01-18-095211.png)
 
Here is the chart for different colors of different light wavelengths. However, human eyes can not feel all the wavelengths equally. As a result, the colors in human eyes should like what shows in this graph:

![2025-01-18-095424.png](images/2025-01-18-095424.png)

For human eyes, there are three most sensetive wavelengths: 645nm--red light, 523nm--green light, and 444nm--blue light. People use these three light to blend and try to make people believe that the blender is representing a certain color. This process is how people defind the RGB light. For example, if we want to use RGB to represent the color of 500nm light wavelength, we can use 0.85G+0.48B+(-0.72)R to simulate this color. We also call this function "color matching function". To calculate, we have R($\lambda$), G($\lambda$) and B($\lambda$). After normalization, they become $\bar{r}（\lambda）$，$\bar{g}（\lambda）$，and $\bar{b}（\lambda）$. Following that, we can calculate the intergral to get the X, Y, Z; like this:
![2025-01-18-101351.png](images/2025-01-18-101351.png)

Which will be used in the color space.

### Color Space
First of all, we convert the X, Y, Z to x, y, z:
![2025-01-18-101550.png](images/2025-01-18-101550.png)

Honestly, in this function, we just need to calculate two variables to get all three values. As a result, we can use a two-dimensional diagram to show visual lights:
![2025-01-18-101843.png](images/2025-01-18-101843.png)

In this diagram, we can point out a triangle which called gamut, represents the field of a certain display. We define a white point to represent white color manually. There are many gamuts used, such as sRGB and DCI-P3.

#### Q1: How to transfer RGB to HSV?
As we already known, HSV is another way to represent a color. How to do the transfer from RGB to HSV?

Firstly, we need to normalize the value of RGB. As a result, we calculate R/255, G/255, and B/255 first. Next, we can calculate the HSV by these functions:
![2025-01-18-103646.png](images/2025-01-18-103646.png)

if the value of H smaller than 0, we need to add 360 to get the correct value.

From the other side, we can calculate from HSV to RGB by this:
![2025-01-18-110436.png](images/2025-01-18-110736.png)


## Part two: image
From part one, we can confirm how to record the color of each pixel. However, if we store them by simple RGB data form (3D vector), every single picture requires huge space to store, which is not reasonable. As a result, we use some compression method to solve this.

### Lossless Compression
For some pictures with a few colors, we can code these colors reduce the space need. For example, a cartoon picture only uses 8 colors, like this:
![2025-01-18-111614.png](images/2025-01-18-111614.png)

We can code this 8 colors so that every color can be represent by 3 bytes(for example, white can be coded 001). After all pixel record the now codes, we add a index to map these 8 colors so that we can take them back without and loss. This is a simple way of lossless compression, it extends the decompression time, but get more space free.

However, this way can not always work especially when the picture has many color, like this:
![2025-01-18-112234.png](images/2025-01-18-112234.png)

We can continue the same thinking, but spilt the image first. we can spilt the picture into many N* N grids and code the colors in grids. As a result, in each grid, the quntity of colors cannot exceed N$\times$N, thay's why it is also useful to compress the image, and it still is lossless.

### Lossy Compression
Instead of using lossless coompression, we can also use lossy compression to record the image.

Before we starting lossy compression, we need to get some conclusion first. The first conclusion is that human eyes are more siensitive to low frequency, such the sky in last picture. The second conclusioon is that human eyes are more sensitive to details in darker environment. As a result, we can use YCbCr to record the color.

Y means luminous information, Cb means chromatic bias from gray for blue and yellow chromes, and Cr means chromatic bias from gray for red and cyan chromes. We can calculate them by RGB:
![2025-01-18-113558.png](images/2025-01-18-113558.png)

Remember, here we use R',G',and B'after Gamma Correction instead of using RGB directly.

Moreover, we can use "sampling X:Y:Z". We can sample part of the Cb and Cr to reduce the space required and calculate other colors through interpolation. Two typical sampling below:
![2025-01-18-114245.png](images/2025-01-18-114245.png)

X means the horizontal sampling width, Y means the first row Cb/Cr sample count, and Z means the second row Cb/Cr sample count.

Honestly, this is not a effecient way because it is just a pre-processing step for funther compression such as JPEG.



## Part three: Vulkan resources
In vulkan, data is included into the resources, and resources are placed in the memory. There are two basic forms of resources: buffer and image.

### Buffer
Buffer is the simplest type of resource. Buffer is used for structured or unstructured data, in other words, it basically includes everything.

![2025-01-18-130829.png](images/2025-01-18-130829.png)

To create a buffer, we need four information: VkDevice, VkBufferCreateInfo*, VkAllocationCallbacks* and VkBuffer*. The structure of VkBufferCreateInfo is below:
![2025-01-18-131120.png](images/2025-01-18-131120.png)

The sType of this should be VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO.

We focus on the usage (VkBufferUsageFlags) in this VkBufferCreateInfo. Usage can tell what and how buffer is being used. For example, it can use for transfer command or texel .etc

Here is a example code:
![2025-01-18-131618.png](images/2025-01-18-131618.png)

### Image
Image is more complex resources. It is used for structured data so it has layouts and formats.

Here are what we need to create a image:
![2025-01-18-131915.png](images/2025-01-18-131915.png)

In image, we focus on the VkImageCreateFlags. When VK_IMAGE_CREATE_MUTABLE_FORMAT_BIT is set, you can create views of the image with a different format from the parent. We have many different VkFormat such as BC, ASTC, ETC and EAC.

#### Q2: Research ASTC, ETC and BC

Adaptive Scalable Texture Compression (ASTC) is the most commonly used compression. In ASTC, every block must use 16 bytes but the size of the block can be changed. We can make the block include less pixel to record more clearly or include more pixel to speed up. The form ASTC can use is below:
![2025-01-18-142025.png](images/2025-01-18-152025.png)

Moreover, it can be used in various format, such as LDR, LDRsRGB, HDR, it can also be used to compress 3D texture.

In a block, color will be by interpolation from two color endpoint. There are 16 endpoint modes can be used, including the changing of channels, encoding method and data range. Even in the same picture you can use different modes for different blocks. Moreover, one single color may be not enough for a block have different colors. So you can apply color partition. Every block can have four color partition. Expect the color endpoint, other pixel will only record the weight of the color. However, storing the weight may couse the waste of space, which can be solved by quint and trit. As a result, all the color can be stored with the most efficent method.
