import React, { useState } from 'react';
import './blog.css';
import { FaBook } from 'react-icons/fa';
import { additionalPosts } from './Data';
import { PiShareFat } from 'react-icons/pi';
import { BiLike, BiDislike } from 'react-icons/bi';
import { HiX, HiOutlineArrowSmRight } from 'react-icons/hi';
import { CiCalendar } from 'react-icons/ci';
import { FaExternalLinkAlt } from "react-icons/fa";

const SwiperSection = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="search__container">
            <input
                className="search__input"
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

const ScrollingCards = ({ posts, openModal }) => {
    return (
        <div className="Blog__scrolling-cards">
            {posts.map(post => (
                <div key={post.id} className="Blog__card" onClick={() => openModal(post)}>
                    <img src={post.imageUrl} alt={post.title} className="Blog__card-image" />
                    <div className="Blog__card-content">
                        <h3 className="Blog__card-title">{post.title}</h3>
                        <p className="Blog__card-date"><CiCalendar className='title__icon' /> {post.date}</p>
                        <p className="Blog__card-text">{post.content}</p>
                        <div className="Blog__card-actions">
                            <button className="Blog__card-button"><BiLike /></button>
                            <button className="Blog__card-button"><BiDislike /></button>
                            <button className="Blog__card-button"><PiShareFat /></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Blog = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);

    const handlePostClick = (post) => {
        try {
            setSelectedPost(post);
        } catch (error) {
            console.error("Error selecting post:", error);
        }
    };

    const handleCloseModal = () => {
        try {
            setSelectedPost(null);
        } catch (error) {
            console.error("Error closing modal:", error);
        }
    };

    const filterPosts = () => {
        try {
            const filtered = additionalPosts.filter(post => {
                const searchLower = searchTerm.toLowerCase();
                const titleMatch = post.title.toLowerCase().includes(searchLower);
                const contentMatch = typeof post.content === 'string'
                    ? post.content.toLowerCase().includes(searchLower)
                    : post.content.join(' ').toLowerCase().includes(searchLower);

                return titleMatch || contentMatch;
            });

            return filtered.reverse(); // Reverse the order of posts here
        } catch (error) {
            console.error("Error filtering posts:", error);
            return []; // Return an empty array if there's an error
        }
    };

    const splitTextIntoChunks = (text, chunkSize) => {
        const words = text.split(' ');
        const chunks = [];
        let currentChunk = '';
    
        words.forEach(word => {
            if (currentChunk.length + word.length + 1 <= chunkSize) {
                currentChunk += (currentChunk ? ' ' : '') + word;
            } else {
                chunks.push(currentChunk);
                currentChunk = word;
            }
        });
    
        if (currentChunk) {
            chunks.push(currentChunk);
        }
    
        return chunks;
    };    

    const PostContent = ({ content }) => {
        const chunkSize = 200;

        return content.map((paragraph, index) => {
            const chunks = splitTextIntoChunks(paragraph, chunkSize);

            return (
                <div key={index}>
                    {chunks.map((chunk, chunkIndex) => (
                        <p key={chunkIndex} className="read__modal-content-text full-text">
                            {chunk}
                            <div style={{ marginBottom: '1rem' }}></div>
                        </p>
                    ))}
                </div>
            );
        });
    };

    const filteredPosts = filterPosts();

    return (
        <section className="Blog container section" id='blog'>
            <h2 className="section__title"><FaBook className='title__icon' /> Blog</h2>
            <span className="section__subtitle">Read a lot</span>
            <SwiperSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <h2 className="section__title blog-sub-section">Latest Posts <HiOutlineArrowSmRight className="services__button-icon title__icon" /></h2>
            <ScrollingCards posts={filteredPosts} openModal={handlePostClick} />
            {selectedPost && (
                <div className="Blog__modal active-modal">
                    <div className="Blog__modal-content">
                        <HiX onClick={handleCloseModal} className="Blog__modal-close" />
                        <div className="reader__container">
                            <img src={selectedPost.imageUrl} alt={selectedPost.title} className="Blog__card-image" />
                            <h2 className="read__modal-title">{selectedPost.title}</h2>
                            <p className="read__card-date"><CiCalendar className='title__icon' /> {selectedPost.date}</p>
                            <PostContent content={selectedPost.content} />
                            <a href={selectedPost.more} rel="noopener noreferrer" target='_blank' className="read__modal-references__link"><FaExternalLinkAlt className='title__icon' /> References</a>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Blog;