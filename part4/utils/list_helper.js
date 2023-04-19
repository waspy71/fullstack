const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (blog, topLikes) => {
        if (blog.likes > topLikes.likes) {
            return {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        } else if (blog.likes <= topLikes.likes) {
            return {
                title: topLikes.title,
                author: topLikes.author,
                likes: topLikes.likes
            } 
        }
    }
    return blogs.reduce(reducer)
}


const mostBlogs = (blogs) => {
    const authors_name = _.countBy(blogs, 'author')

    const the_name = _.max(Object.keys(authors_name), function(o) {
        return authors_name[o];
    });
    
    
        result = {
            author: the_name,
            blogs: authors_name[the_name]
        }
    

    return result
}

const mostLikes = (blogs) => {
    let authors_name = _.countBy(blogs, 'author')

    const n = {}
    const n_arr = Object.keys(n)
    const x = Object.keys(authors_name)
    const most = blogs.forEach(item => {
        if (x.includes(item.author)) {
            const auth = item.author 
            if (n_arr.includes(auth)) {
                n[auth] += item.likes
            } else {
                n[auth] = item.likes
                n_arr.push(auth)
            }
        }
    })
    
    const topLikes = _.maxBy(Object.keys(n), function(o) {
        return n[o]
    })
    
    
        result = {
            author: topLikes,
            likes: n[topLikes]
        }
        return result
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}