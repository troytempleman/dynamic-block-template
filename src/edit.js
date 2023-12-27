// External dependencies
import classnames from 'classnames';

// WordPress dependencies
import { 
	AlignmentToolbar, 
	BlockControls,
	InspectorControls, 
	RichText, 
	useBlockProps 
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl, 
	SelectControl, 
	TextControl
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { RawHTML } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// Internal dependencies
import { usePostTypes } from './utils';

// Editor styles
import './editor.scss';

// Edit
export default function Edit( { attributes, setAttributes } ) {
	
	// Attributes
	const { 
		textAlign,
		title,
		postType,
		numberOfPosts
	} = attributes;
	
	// Block content
	const blockContent = () => {	
	
		// Wrapper 
		const wrapperAttributes = useBlockProps( {
			className: classnames( {
				[ `has-text-align-${ textAlign }` ]: textAlign,
			} ),
		} );
		
		// Query
		const query = useSelect( 
			( select ) => {
				return select( 'core' ).getEntityRecords( 
					'postType', 
					postType, {
						'per_page': numberOfPosts,
						'orderby': 'date',
						'order': 'desc',
						'ignore_sticky_posts': true,
						'no_found_rows': true,
						'_embed': true
					} 
				)
			},
			[
				postType,
				numberOfPosts
			]
		);	
		
		// Posts
		const posts = (
			query && query.map( ( post ) => {
			
				// Post
				return (
					<li
						key={ post.id }
						className='wp-block-tt-dynamic-block-template-list-item'
					>
						<a 
							className='wp-block-tt-dynamic-block-template-list-item-link'
							href={ post.link }
						>
							<RawHTML>
								{ post.title.rendered }
							</RawHTML>
						</a>	
					</li>
				)
			} ) 
		);
		
		return(	
			<div { ...wrapperAttributes }>
				<RichText
					tagName="h2"
					className="wp-block-tt-dynamic-block-template-title"
					value={ title }
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
					placeholder={ __( 'Add title', 'dynamic-block-template' ) }
					onChange={ ( value ) => setAttributes( { title: value } ) }
				/>
				<ul className="wp-block-tt-dynamic-block-template-list">{ posts }</ul>
			</div>
		)
	}

	// Inspector controls
	const inspectorControls = () => {		
		
		// Post type select options
		const { postTypesSelectOptions } = usePostTypes();
			
		return(	
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'dynamic-block-template' ) }>
						<TextControl
							label={ __( 'Title', 'dynamic-block-template' ) }
							value={ title }
							onChange={ ( value ) => setAttributes( { title: value } ) }
						/>
						<SelectControl
				            label={ __( 'Post type', 'dynamic-block-template' ) }
				            value={ postType }
				            options={ postTypesSelectOptions }
				            onChange={ ( value ) => setAttributes( { postType: value } ) }
				        />
						<RangeControl
							label={ __( 'Number of posts', 'dynamic-block-template' ) }
							value={ numberOfPosts }
							onChange={ ( value ) => setAttributes( { numberOfPosts: value } ) }
							min={ 1 }
							max={ 10 }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		)
	}
	
	// Block controls
	const blockControls = () => {
		return(	
			<BlockControls >
				<AlignmentToolbar
					value={ textAlign }
					onChange={ ( value ) => setAttributes( { textAlign: value } ) }
				/>
			</BlockControls>
		)
	}
	
	return (
		<>
			{ inspectorControls() }
			{ blockControls() }
			{ blockContent() }
		</>
	);
}