import { defineEventHandler, createError } from 'h3'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get authenticated user (vet)
    const user = event.context.auth?.user
    if (!user || user.role !== 'vet') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Fetch chats for this vet (consultations with messages)
    const consultations = await prisma.consultation.findMany({
      where: {
        vetId: user.id,
        status: {
          in: ['ACTIVE', 'PENDING', 'COMPLETED'] // Include active consultations
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'asc'
          },
          take: 50 // Last 50 messages
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: {
                  not: user.id // Unread messages from users
                }
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Transform data for frontend
    const transformedChats = consultations.map((consultation: any) => ({
      id: consultation.id,
      userId: consultation.user.id,
      name: consultation.user.name,
      avatar: consultation.user.avatar || '/placeholder-avatar.svg',
      lastMessage: consultation.messages[consultation.messages.length - 1]?.content || 'گفتگوی جدید',
      time: consultation.messages[consultation.messages.length - 1]?.createdAt
        ? new Date(consultation.messages[consultation.messages.length - 1].createdAt).toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'جدید',
      status: consultation.status === 'ACTIVE' ? 'online' : 'offline',
      statusText: consultation.status === 'ACTIVE' ? 'فعال' : 'پایان یافته',
      unread: consultation._count.messages,
      isTyping: false,
      messages: consultation.messages.map((msg: any) => ({
        id: msg.id,
        sender: msg.senderId === user.id ? 'vet' : 'user',
        text: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString('fa-IR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        read: msg.isRead,
        file: msg.fileUrl ? {
          name: msg.fileName,
          url: msg.fileUrl,
          type: msg.type
        } : null
      }))
    }))

    return {
      success: true,
      chats: transformedChats
    }

  } catch (error) {
    console.error('Error fetching chats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})