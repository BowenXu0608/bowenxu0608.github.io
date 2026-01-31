---
title: Week 10 Homework

---

# Week 10 Homework: The Worst Case of VSync
In this homework we will try to think about the worst case of VSync.

## Case one: Buffer Deadlock
As we know, the principle of VSync involves using two buffers: one for storing the image currently being displayed by the computer, and another for generating the next image in preparation for display. When the monitor refreshes, the two buffers switch roles and repeat this cycle. However, if an error occurs during the switch—such as failing to receive the V-blank signal, which causes a buffer deadlock—the system cannot send a new image to the monitor. Furthermore, since some monitors are configured to refresh only upon receiving a new image, the display may completely stop.

## Case two: Computation Bound to Frame Rate
In some older games, programmers often used the time taken for image rendering on the graphics card to calculate certain statuses, such as a character's speed. However, even if the actual frame rate of the graphics is high, the system must wait for the monitor to refresh. As a result, the time used in calculations becomes longer, which can cause significant errors. For example, a character's walking distance is calculated by multiplying time by speed. If the time value becomes too large, the character may end up walking too far, potentially even passing through walls.

## Case three: Power Management Bug
For some special griphics card, they can adjust their power based on different loads. When the monitor's frame rate is lower than the graphics card's frame rate, the card may reduce its power to save energy. However, if the power is reduced too much and the frame rate falls below the monitor's rate, the frame rate will be halved, which may cause the card to further reduce power. After several cycles, the frame rate may become too low for proper display.